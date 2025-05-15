import axiosClient from '@/global/api/axiosClient'
import type {
  LoginRequest,
  SignupRequest,
  WebResponseDto,
  PasswordChangeRequest,
} from '../types/auth.types'

/**
 * 인증 관련 API 함수 모음
 */
export const authApi = {
  /**
   * 회원가입 요청
   */
  signup(data: SignupRequest) {
    return axiosClient.post<WebResponseDto>('/auth/web/signup', data)
  },

  /**
   * 로그인 요청
   */
  login(data: LoginRequest) {
    return axiosClient.post<WebResponseDto>('/auth/web/login', data)
  },

  /**
   * 토큰 갱신 요청
   */
  refreshToken() {
    return axiosClient.post<void>('/auth/web/refresh')
  },

  /**
   * 로그아웃 요청
   */
  logout() {
    return axiosClient.post<void>('/auth/web/logout')
  },

  /**
   * 비밀번호 변경 요청
   */
  changePassword(data: PasswordChangeRequest) {
    return axiosClient.post<void>('/auth/web/password', data)
  },

  /**
   * 인증 상태 확인 요청
   */
  checkAuth() {
    return axiosClient.get<WebResponseDto>('/user/me')
  },
}
