import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

// API 클라이언트 생성
const axiosClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 요청 인터셉터 설정
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 쿠키 기반 인증이므로 추가 헤더는 필요 없음
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 설정
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    // 401 에러 발생 시 토큰 리프레시 시도
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // 토큰 갱신 시도
        const authStore = useAuthStore()
        await authStore.refreshToken()
        
        // 토큰 갱신 성공 시 원래 요청 재시도
        return axiosClient(originalRequest)
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        const authStore = useAuthStore()
        authStore.logout()
        
        // 로그인 페이지로 이동
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default axiosClient