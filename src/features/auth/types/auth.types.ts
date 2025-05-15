export interface SignupRequest {
  name: string
  email: string
  password: string
  phone: string
  ssn?: string
  address?: AddressDto
}

export interface LoginRequest {
  email: string
  password: string
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface TokenRefreshRequest {
  refreshToken: string
}

export interface TokenInfo {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
}

export interface WebResponseDto {
  email: string
  role: string
  maskedName: string
  authenticated: boolean
}

export interface MobileResponseDto {
  email: string
  role: string
  maskedName: string
  token: TokenInfo
}

export interface AddressDto {
  id?: number
  zipCode?: string
  region?: string
  regionCode?: string
  city?: string
  cityCode?: string
  detail?: string
  maskedDetail?: string
  // 프론트엔드에서 사용하는 추가 필드
  address1?: string
  address2?: string
}

export interface UserDto {
  id: number
  name?: string
  maskedName?: string
  phone?: string
  maskedPhone?: string
  ssn?: string
  maskedSsn?: string
  email: string
  address?: AddressDto
}

export interface UserUpdateRequestDto {
  name: string
  phone: string
  email: string
  address?: AddressDto
}
