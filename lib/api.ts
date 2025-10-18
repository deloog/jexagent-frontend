import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器（添加token）
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器（处理错误）
apiClient.interceptors.response.use(
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

// ========== 认证API ==========
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },
  
  getMe: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}

// ========== 用户API ==========
export const userAPI = {
  getQuota: async () => {
    const response = await apiClient.get('/users/me/quota')
    return response.data
  },
}

// ========== 任务API ==========
export const taskAPI = {
  create: async (data: { scene: string; user_input: string }) => {
    const response = await apiClient.post('/tasks', data)
    return response.data
  },
  
  submitAnswers: async (
    taskId: string,
    data: {
      answers: Record<number, string>
      intermediate_state: unknown
    }
  ) => {
    const response = await apiClient.post(`/tasks/${taskId}/answers`, data)
    return response.data
  },
  
  getTask: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}`)
    return response.data
  },
  
  listTasks: async () => {
    const response = await apiClient.get('/tasks')
    return response.data
  },

  startProcessing: async (taskId: string) => {
    const response = await apiClient.post(`/tasks/${taskId}/start-processing`)
    return response.data
  },

  getTaskResult: async (taskId: string) => {
    const response = await apiClient.get(`/tasks/${taskId}`)
    return response.data
  },
}

export default apiClient
