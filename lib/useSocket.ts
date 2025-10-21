import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { enhancedTaskAPI } from './api-retry';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000';
const DEBUG = process.env.NODE_ENV === 'development';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface ProgressUpdate {
  phase: string;
  progress: number;
  message: string;
  timestamp: string;
  sequence_id?: number;
  task_id?: string;
}

interface AIMessage {
  actor: string;
  content: string;
  timestamp: string;
}

interface CompleteMessage {
  output: unknown;
}

// 🔥 成本更新接口
interface CostUpdate {
  current_cost: number;
  phase_cost: number;
  phase: string;
  breakdown: {
    deepseek: number;
    kimi: number;
    qwen: number;
  };
}

export function useSocket(taskId: string | null) {
  const [progressHistory, setProgressHistory] = useState<ProgressUpdate[]>([])
  const [latestProgress, setLatestProgress] = useState<ProgressUpdate | null>(null)
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [completionData, setCompletionData] = useState<CompleteMessage | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const [costData, setCostData] = useState<CostUpdate | null>(null)
  
  const socketRef = useRef<Socket | null>(null)
  const hasJoinedRoomRef = useRef(false)
  // ✅ 修复1：使用 taskId-seqId 组合键
  const processedKeysRef = useRef<Set<string>>(new Set())
  const isInitialSyncDoneRef = useRef(false)

  // ✅ 修复2：去重key加taskId前缀
  const addProgress = useCallback((newProgress: ProgressUpdate) => {
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
      const history: ProgressUpdate[] = await enhancedTaskAPI.syncProgressHistory(taskId)
      
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

  // 主useEffect：创建socket实例和管理taskId相关状态
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
    processedKeysRef.current.clear()
    isInitialSyncDoneRef.current = false

    console.log(`🔄 Initializing WebSocket for task: ${taskId}`)

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
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
      
      if (socketRef.current) {
        socketRef.current.onAny((event, ...args) => {
          console.log('[BROWSER] 收到任意事件', event, args);
        });
      }
    })

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${reason}`)
      setConnectionStatus('disconnected')
      hasJoinedRoomRef.current = false
      processedKeysRef.current.clear()
    })

    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`)
      setConnectionStatus('connected')
      
      // 🔥 关键修复：热替换重连时强制重新加入房间
      console.log(`🎯 热替换重连，强制重新进房: ${taskId}`)
      hasJoinedRoomRef.current = false
      joinTaskRoom()
      syncProgressHistory(taskId)
    })

    socket.on('joined', (data: { task_id: string }) => {
      console.log('✅ Joined task room:', data.task_id)
    })

    if (socket.connected) {
      joinTaskRoom()
      syncProgressHistory(taskId)
    }

    return () => {
      console.log('🧹 Cleaning up WebSocket (taskId changed)')
      hasJoinedRoomRef.current = false
      processedKeysRef.current.clear()
      socket.disconnect()
      socketRef.current = null
    }
  }, [taskId, syncProgressHistory])

  // 监听器useEffect：注册所有事件监听器，依赖socket实例
  useEffect(() => {
    const socket = socketRef.current
    if (!socket) return

    console.log('[SOCKET] 注册监听器时 socket.id =', socket.id)

    const handleProgress = (data: ProgressUpdate) => {
      if (DEBUG) console.log('📊 收到实时进度:', data)
      addProgress(data)
    }

    const handleAiMessage = (data: AIMessage) => {
      if (DEBUG) console.log('🤖 AI Message:', data)
      setAiMessages(prev => [...prev, data])
    }

    const handleComplete = (data: CompleteMessage) => {
      console.log('✅ Task complete:', data)
      setIsComplete(true)
      setCompletionData(data)
      processedKeysRef.current.clear()
    }

    const handleCostUpdate = (data: CostUpdate) => {
      console.log('💰 [DEBUG] 收到成本更新事件:', data)
      
      // 🔥 健壮性改进：验证成本数据格式
      if (!data || typeof data.current_cost !== 'number' || !data.breakdown) {
        console.warn('⚠️ 收到无效的成本数据格式:', data)
        return
      }
      
      // 🔥 健壮性改进：确保成本数据完整性
      const validatedData: CostUpdate = {
        current_cost: Math.max(0, data.current_cost || 0),
        phase_cost: Math.max(0, data.phase_cost || 0),
        phase: data.phase || 'unknown',
        breakdown: {
          deepseek: Math.max(0, data.breakdown?.deepseek || 0),
          kimi: Math.max(0, data.breakdown?.kimi || 0),
          qwen: Math.max(0, data.breakdown?.qwen || 0),
        }
      }
      
      setCostData(validatedData)
    }

    const handleError = (data: { error: string }) => {
      console.error('❌ Task error:', data)
    }

    const handleAny = (event: string, ...args: any[]) => {
      console.log('[DEBUG] 收到任意事件', event, args, 'socket.id=', socket.id)
    }

    // 注册所有事件监听器
    socket.on('progress', handleProgress)
    socket.on('ai_message', handleAiMessage)
    socket.on('complete', handleComplete)
    socket.on('cost_update', handleCostUpdate)
    socket.on('error', handleError)
    socket.onAny(handleAny)

    // 统一清理函数，防止内存泄漏
    return () => {
      console.log('🧹 Cleaning up event listeners')
      socket.off('progress', handleProgress)
      socket.off('ai_message', handleAiMessage)
      socket.off('complete', handleComplete)
      socket.off('cost_update', handleCostUpdate)
      socket.off('error', handleError)
      socket.offAny(handleAny)
    }
  }, [socketRef.current]) // ✅ 修复：依赖 socket 实例，确保新 socket 重新注册监听器

  return {
    progressHistory,
    latestProgress,
    aiMessages,
    isComplete,
    completionData,
    connectionStatus,
    costData,
  }
}
