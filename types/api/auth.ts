export type LoginRequest = {
  email: string
  password: string
}

export type Role = 'OWNER' | 'PLANNER' | 'OPERATOR' | 'QC' | 'MAINTENANCE' | 'EMPLOYEE' | 'USER'

export type TokenResponse = {
  tokenType?: 'Bearer'
  accessToken?: string | null
  refreshToken?: string | null
  token?: string | null
}

export type MeResponse = {
  id: number
  name?: string | null
  full_name?: string | null
  email: string
  role?: Role | string | null
  active?: boolean
  factoryId?: number | null
  department?: string | null
  company?: string | null
  phone?: string | null
  status?: number | null
  hotel_id?: number | null
  chain_id?: number | null
}

export type LoginResponse = {
  token: string | null
  user?: unknown
}

export type RegisterRequest = {
  name?: string
  email: string
  password: string
  password_confirmation: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export type ChangePasswordRequest = {
  current_password: string
  password: string
  password_confirmation: string
}
