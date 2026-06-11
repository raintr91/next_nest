import {
  LoginResponseSchema,
  TokenResponseSchema
} from '~/models/auth/auth.schema'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from '~/models/auth/auth.types'
import { UserMeSchema } from '~/models/user/user.schema'
import type { ApiResponse } from '~/models/common/api.types'
import { assertApiSuccess } from '~/services/shared/apiResponse'
import { parseApiData } from '~/services/shared/parseApiData'

type ApiFetch = <T>(url: string, options?: Record<string, unknown>) => Promise<T>

export function createAuthService(apiFetch: ApiFetch) {
  return {
    async login(payload: LoginRequest) {
      const res = await apiFetch<ApiResponse<unknown>>('/api/auth/login', {
        method: 'POST',
        body: payload
      })
      assertApiSuccess(res)
      return parseApiData(LoginResponseSchema, res.data)
    },

    async register(payload: RegisterRequest) {
      const res = await apiFetch<ApiResponse<unknown>>('/api/auth/register', {
        method: 'POST',
        body: { name: payload.name ?? 'User', email: payload.email, password: payload.password }
      })
      assertApiSuccess(res)
      return parseApiData(TokenResponseSchema, res.data)
    },

    async fetchMe() {
      const res = await apiFetch<ApiResponse<unknown>>('/api/auth/me', { method: 'GET' })
      assertApiSuccess(res)
      return parseApiData(UserMeSchema, res.data)
    },

    async forgotPassword(payload: ForgotPasswordRequest) {
      const res = await apiFetch<ApiResponse<null>>('/api/auth/forgot-pass', {
        method: 'POST',
        body: payload
      })
      assertApiSuccess(res)
      return res
    },

    async resetPassword(payload: ResetPasswordRequest) {
      const res = await apiFetch<ApiResponse<null>>('/api/auth/reset-pass', {
        method: 'POST',
        body: payload
      })
      assertApiSuccess(res)
      return res
    },

    async changePassword(_payload: ChangePasswordRequest) {
      throw new Error('changePassword not implemented for this portal')
    },

    async logout() {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    }
  }
}

export type AuthService = ReturnType<typeof createAuthService>
