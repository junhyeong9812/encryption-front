import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/features/auth/api/auth.api'
import router from '@/router'
import type { LoginRequest, SignupRequest, WebResponseDto } from '@/features/auth/types/auth.types'

interface ErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 상태
    const user = ref<WebResponseDto | null>(null)
    const isAuthenticated = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // 액션
    /**
     * 로그인 처리
     */
    const login = async (loginData: LoginRequest) => {
      isLoading.value = true
      error.value = null

      try {
        const response = await authApi.login(loginData)
        user.value = response.data
        isAuthenticated.value = true

        // 리다이렉트 경로가 있으면 해당 경로로, 없으면 홈으로 이동
        const redirectPath = (router.currentRoute.value.query.redirect as string) || '/'
        router.push(redirectPath)

        return response.data
      } catch (err: unknown) {
        const errorData = err as ErrorResponse
        error.value =
          errorData.response?.data?.message || errorData.message || '로그인 중 오류가 발생했습니다.'
        throw error.value
      } finally {
        isLoading.value = false
      }
    }

    /**
     * 회원가입 처리
     */
    const signup = async (signupData: SignupRequest) => {
      isLoading.value = true
      error.value = null

      try {
        const response = await authApi.signup(signupData)
        user.value = response.data
        isAuthenticated.value = true

        router.push('/')
        return response.data
      } catch (err: unknown) {
        const errorData = err as ErrorResponse
        error.value =
          errorData.response?.data?.message ||
          errorData.message ||
          '회원가입 중 오류가 발생했습니다.'
        throw error.value
      } finally {
        isLoading.value = false
      }
    }

    /**
     * 로그아웃 처리
     */
    const logout = async () => {
      isLoading.value = true

      try {
        await authApi.logout()
      } catch (err) {
        console.error('로그아웃 중 오류:', err)
      } finally {
        // 로컬 상태 초기화
        user.value = null
        isAuthenticated.value = false
        isLoading.value = false

        // 로그인 페이지로 이동
        router.push('/login')
      }
    }

    /**
     * 인증 상태 확인
     */
    const checkAuth = async () => {
      isLoading.value = true

      try {
        const response = await authApi.checkAuth()
        user.value = response.data
        isAuthenticated.value = true
        return response.data
      } catch (err) {
        // 액세스 토큰이 유효하지 않으면 토큰 갱신 시도
        try {
          await refreshToken()
          const response = await authApi.checkAuth()
          user.value = response.data
          isAuthenticated.value = true
          return response.data
        } catch (refreshErr) {
          user.value = null
          isAuthenticated.value = false
          throw refreshErr
        }
      } finally {
        isLoading.value = false
      }
    }

    /**
     * 토큰 갱신
     */
    const refreshToken = async () => {
      try {
        await authApi.refreshToken()
        return true
      } catch (err) {
        user.value = null
        isAuthenticated.value = false
        throw err
      }
    }

    return {
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      signup,
      logout,
      checkAuth,
      refreshToken,
    }
  },
  {
    persist: true,
  },
)
