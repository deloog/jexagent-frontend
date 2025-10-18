import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { enhancedTaskAPI } from './api-retry'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000'
const DEBUG = process.env.NODE_ENV === 'development'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ProgressMessage {
  phase: string
  progress: number
  message: string
  ts?: number
  sequence_id?: number
  task_id?: string
}

interface AIMessage {
  actor: string
  content: string
}

interface CompleteMessage {
  output: unknown
}

export function useSocket(taskId: string | null) {
  const [progressHistory, setProgressHistory] = useState<ProgressMessage[]>([])
  const [latestProgress, setLatestProgress] = useState<ProgressMessage | null>(null)
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [completionData, setCompletionData] = useState<CompleteMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  
  const socketRef = useRef<Socket | null>(null)
  const hasJoinedRoomRef = useRef(false)
  // ✅ 修复1：使用 taskId-seqId 组合键
  const processedKeysRef = useRef<Set<string>>(new Set())
  const isInitialSyncDoneRef = useRef(false)

  // ✅ 修复2：去重key加taskId前缀
  const addProgress = useCallback((newProgress: ProgressMessage) => {
    const seqId = newProgress.sequence_id
    if (seqId === undefined) {
      console.warn('⚠️ 收到无序列号的进度，跳过')
      return
    }

    const dedupeKey = `${taskId}-${seqId}`
    if (processedKeysRef.current.has(dedupeKey)) {
      if (DEBUG) console.log(`⏭️ 跳过重复进度: ${dedupeKey}`)
      return
    }

    processedKeysRef.current.add(dedupeKey)
    
    setProgressHistory(prev => {
      const updated = [...prev, newProgress].sort((a, b) => 
        (a.sequence_id || 0) - (b.sequence_id || 0)
      )
      return updated
    })
    
    setLatestProgress(newProgress)
    
    if (DEBUG) {
      console.log(`✅ 添加进度: ${dedupeKey}, phase=${newProgress.phase}, progress=${newProgress.progress}%`)
    }
  }, [taskId])

  // ✅ 修复3：批量处理历史进度（使用重试API）
  const syncProgressHistory = useCallback(async (taskId: string) => {
    try {
      console.log('🔄 开始同步历史进度...')
      const history: ProgressMessage[] = await enhancedTaskAPI.syncProgressHistory(taskId)
      
      console.log(`📋 获取到历史进度: ${history.length} 条`)
      
      if (history.length > 0) {
        // ✅ 批量处理，避免多次setState
        setProgressHistory(prev => {
          const newItems = history.filter(h => {
            const key = `${taskId}-${h.sequence_id}`;
            return !processedKeysRef.current.has(key);
          });
          
          newItems.forEach(h => {
            const key = `${taskId}-${h.sequence_id}`;
            processedKeysRef.current.add(key);
          });
          
          return [...prev, ...newItems].sort((a, b) => 
            (a.sequence_id || 0) - (b.sequence_id || 0)
          );
        });
        
        setLatestProgress(history[history.length - 1]);
        isInitialSyncDoneRef.current = true;
        console.log(`✅ 历史进度同步完成`);
      }
    } catch (error) {
      console.error('❌ 同步历史进度失败（已重试）:', error)
    }
  }, [taskId])

  useEffect(() => {
    if (!taskId) {
      console.log('⚠️ No taskId, skipping WebSocket')
      return
    }

    // ✅ 修复4：taskId变化时清空所有状态
    setProgressHistory([])
    setLatestProgress(null)
    setAiMessages([])
    setIsComplete(false)
    setCompletionData(null)
    setConnectionStatus('connecting')
    hasJoinedRoomRef.current = false
    processedKeysRef.current.clear() // ← 关键：清空去重Set
    isInitialSyncDoneRef.current = false

    console.log(`🔄 Initializing WebSocket for task: ${taskId}`)

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,  // ✅ 从10提升到20，覆盖99%瞬断
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,  // ✅ 退避上限从5s调到10s
      timeout: 20000,
    })
    
    socketRef.current = socket

    const joinTaskRoom = () => {
      if (socket.connected && !hasJoinedRoomRef.current) {
        console.log(`🎯 Joining task room: ${taskId}`)
        socket.emit('join_task', { task_id: taskId })
        hasJoinedRoomRef.current = true
      }
    }

    socket.on('connect', () => {
      console.log('🔌 Socket connected')
      setConnectionStatus('connected')
      joinTaskRoom()
      syncProgressHistory(taskId)
    })

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${reason}`)
      setConnectionStatus('disconnected')
      hasJoinedRoomRef.current = false
      // ✅ 修复5：断开时清空Set
      processedKeysRef.current.clear()
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`)
      setConnectionStatus('connected')
      joinTaskRoom()
      syncProgressHistory(taskId)
    })

    socket.on('joined', (data: { task_id: string }) => {
      console.log('✅ Joined task room:', data.task_id)
    })

    socket.on('progress', (data: ProgressMessage) => {
      if (DEBUG) console.log('📊 收到实时进度:', data)
      addProgress(data)
    })

    socket.on('ai_message', (data: AIMessage) => {
      if (DEBUG) console.log('🤖 AI Message:', data)
      setAiMessages(prev => [...prev, data])
    })

    socket.on('complete', (data: CompleteMessage) => {
      console.log('✅ Task complete:', data)
      setIsComplete(true)
      setCompletionData(data)
      // ✅ 修复6：完成时清空Set
      processedKeysRef.current.clear()
    })

    socket.on('error', (data: { error: string }) => {
      console.error('❌ Task error:', data)
    })

    if (socket.connected) {
      joinTaskRoom()
      syncProgressHistory(taskId)
    }

    return () => {
      console.log('🧹 Cleaning up WebSocket')
      hasJoinedRoomRef.current = false
      processedKeysRef.current.clear()
      socket.disconnect()
      socketRef.current = null // ✅ 加上这行更清晰
    }
  }, [taskId, syncProgressHistory, addProgress])

  return {
    progressHistory,
    latestProgress,
    aiMessages,
    isComplete,
    completionData,
    connectionStatus,
  }
}
