import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCookie } from 'nuxt/app'

import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TokenResponse
} from '~/models/auth/auth.types'
import type { UserMe } from '~/models/user/user.types'
import { createAuthService } from '~/services/auth.service'

export const useAuth = defineStore('useAuth', () => {
  const { $apiFetch } = useNuxtApp()
  const authService = createAuthService($apiFetch)

  const tokenCookie = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    secure: false
  })

  const refreshTokenCookie = useCookie<string | null>('refresh_token', {
    sameSite: 'lax',
    secure: false
  })

  const userCookie = useCookie<UserMe | null>('auth_user', {
    sameSite: 'lax',
    secure: false
  })

  const token = computed(() => tokenCookie.value)
  const isAuthenticated = computed(() => Boolean(tokenCookie.value))
  const user = computed(() => userCookie.value)

  const setToken = (value: string | null) => { tokenCookie.value = value }
  const setRefreshToken = (value: string | null) => { refreshTokenCookie.value = value }
  const setUser = (value: UserMe | null) => { userCookie.value = value }

  const logout = () => {
    setToken(null)
    setRefreshToken(null)
    setUser(null)
  }

  const setTokensFromResponse = (data: TokenResponse) => {
    setToken(data.accessToken ?? data.token ?? null)
    setRefreshToken(data.refreshToken ?? null)
  }

  const fetchMe = async () => {
    if (!tokenCookie.value) {
      setUser(null)
      return null
    }
    try {
      const user = await authService.fetchMe()
      setUser(user)
      return user
    } catch {
      return userCookie.value
    }
  }

  const login = async (payload: LoginRequest) => {
    logout()
    const data = await authService.login(payload)

    const issuedToken = data.accessToken ?? data.token ?? null
    if (!issuedToken) {
      throw new Error('Login succeeded but token was not returned.')
    }

    setToken(issuedToken)
    setRefreshToken(data.refreshToken ?? null)

    if (data.user) {
      setUser(data.user)
    } else {
      await fetchMe()
    }
    return data
  }

  const register = async (payload: RegisterRequest) => {
    const data = await authService.register(payload)
    setTokensFromResponse(data)
    await fetchMe()
    return data
  }

  const forgotPassword = async (payload: ForgotPasswordRequest) => {
    return authService.forgotPassword(payload)
  }

  const resetPassword = async (payload: ResetPasswordRequest) => {
    return authService.resetPassword(payload)
  }

  const changePassword = async (payload: ChangePasswordRequest) => {
    return authService.changePassword(payload)
  }

  const apiLogout = async () => {
    try {
      await authService.logout()
    } finally {
      logout()
    }
  }

  return {
    token,
    isAuthenticated,
    user,
    setToken,
    setRefreshToken,
    setUser,
    logout,
    login,
    register,
    forgotPassword,
    resetPassword,
    changePassword,
    apiLogout,
    fetchMe
  }
})
