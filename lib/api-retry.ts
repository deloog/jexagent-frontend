import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// 重试配置接口
interface RetryConfig {
  maxRetries: number
  baseDelay: number
  retryCondition?: (error: any) => boolean
}

// 默认重试配置
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  retryCondition: (error) => {
    // 重试网络错误和5xx服务器错误
    return !error.response || error.response.status >= 500
  }
}

// 扩展Axios配置以支持重试
declare module 'axios' {
  interface AxiosRequestConfig {
    retry?: RetryConfig
    retryCount?: number
  }
}

/**
 * 创建带重试机制的axios实例
 */
export function createRetryClient(customConfig?: Partial<RetryConfig>): AxiosInstance {
  const config = { ...DEFAULT_RETRY_CONFIG, ...customConfig }
  
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 请求拦截器（添加token）
  client.interceptors.request.use((requestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }
    
    // 初始化重试计数
    if (requestConfig.retry) {
      requestConfig.retryCount = 0
    }
    
    return requestConfig
  })

  // 响应拦截器（处理重试逻辑）
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const config = error.config
      
      // 检查是否应该重试
      if (!config || !config.retry) {
        return Promise.reject(error)
      }
      
      const retryConfig = config.retry
      const currentRetryCount = config.retryCount || 0
      
      // 检查重试条件
      const shouldRetry = retryConfig.retryCondition 
        ? retryConfig.retryCondition(error)
        : DEFAULT_RETRY_CONFIG.retryCondition!(error)
      
      if (!shouldRetry || currentRetryCount >= retryConfig.maxRetries) {
        return Promise.reject(error)
      }
      
      // 更新重试计数
      config.retryCount = currentRetryCount + 1
      
      // 指数退避延迟
      const delay = retryConfig.baseDelay * Math.pow(2, currentRetryCount)
      console.log(`🔄 API重试 (${config.retryCount}/${retryConfig.maxRetries})，延迟 ${delay}ms`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return client(config)
    }
  )

  // 错误处理拦截器
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token过期，跳转登录
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
  
  return client
}

// 创建默认的重试客户端
const retryClient = createRetryClient()

// ========== 增强版认证API ==========
export const enhancedAuthAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await retryClient.post('/auth/register', data, {
      retry: { maxRetries: 2, baseDelay: 1000 }
    })
    return response.data
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await retryClient.post('/auth/login', data, {
      retry: { maxRetries: 2, baseDelay: 1000 }
    })
    return response.data
  },
  
  getMe: async () => {
    const response = await retryClient.get('/auth/me', {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },
}

// ========== 增强版用户API ==========
export const enhancedUserAPI = {
  getQuota: async () => {
    const response = await retryClient.get('/users/me/quota', {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },
}

// ========== 增强版任务API ==========
export const enhancedTaskAPI = {
  create: async (data: { scene: string; user_input: string }) => {
    const response = await retryClient.post('/tasks', data, {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },
  
  submitAnswers: async (
    taskId: string,
    data: {
      answers: Record<number, string>
      intermediate_state: unknown
    }
  ) => {
    const response = await retryClient.post(`/tasks/${taskId}/answers`, data, {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },
  
  getTask: async (taskId: string) => {
    const response = await retryClient.get(`/tasks/${taskId}`, {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },
  
  listTasks: async () => {
    const response = await retryClient.get('/tasks', {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },

  startProcessing: async (taskId: string) => {
    const response = await retryClient.post(`/tasks/${taskId}/start-processing`, null, {
      retry: { maxRetries: 5, baseDelay: 1000 } // 更多重试次数，因为这是关键操作
    })
    return response.data
  },

  getTaskResult: async (taskId: string) => {
    const response = await retryClient.get(`/tasks/${taskId}`, {
      retry: { maxRetries: 3, baseDelay: 1000 }
    })
    return response.data
  },

  // 专门用于进度同步的API
  syncProgressHistory: async (taskId: string) => {
    const response = await retryClient.get(`/tasks/${taskId}/progress`, {
      retry: { maxRetries: 5, baseDelay: 1000 } // 进度同步需要更多重试
    })
    return response.data
  }
}

// 导出创建自定义客户端的方法
export default retryClient
