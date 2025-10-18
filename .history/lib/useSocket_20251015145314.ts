import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000'

interface ProgressMessage {
  phase: string
  progress: number
  message: string
}

interface AIMessage {
  actor: string
  content: string
}

interface CompleteMessage {
  output: unknown
}

interface ErrorMessage {
  error: string
}

export function useSocket(taskId: string | null) {
  const [isConnected, setIsConnected] = useState(false)
  const [progress, setProgress] = useState<ProgressMessage | null>(null)
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!taskId) return

    // 创建Socket连接
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })
    
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
      
      // 加入任务房间
      socket.emit('join_task', { task_id: taskId })
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socket.on('joined', (data: any) => {
      console.log('Joined task room:', data.task_id)
    })

    socket.on('progress', (data: ProgressMessage) => {
      console.log('Progress:', data)
      setProgress(data)
    })

    socket.on('ai_message', (data: AIMessage) => {
      console.log('AI Message:', data)
      setAiMessages((prev) => [...prev, data])
    })

    socket.on('complete', (data: CompleteMessage) => {
      console.log('Task complete:', data)
      setIsComplete(true)
      setResult(data.output)
    })

    socket.on('error', (data: ErrorMessage) => {
      console.error('Task error:', data)
      setError(data.error)
    })

    // 清理
    return () => {
      socket.disconnect()
    }
  }, [taskId])

  return {
    isConnected,
    progress,
    aiMessages,
    isComplete,
    result,
    error,
  }
}
