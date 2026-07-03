import { describe, expect, it, vi, beforeEach } from 'vitest'

import { mockNuxtApiFetch } from '~/tests/unit/_helpers/nuxtGlobals'

const mockCreate = vi.fn()
const mockPush = vi.fn()

vi.mock('~/mocks/admin-hotel.mock', () => ({
  adminHotelMockCreate: (...args: unknown[]) => mockCreate(...args)
}))

vi.stubGlobal('useRouter', () => ({ push: mockPush }))

vi.mock('~/composables/forms/useApiForm', () => ({
  useApiForm: <T extends Record<string, unknown>>(options: {
    initialValues: T
    submit: (values: T) => Promise<void>
  }) => ({
    onSubmit: async () => {
      await options.submit({
  "name": "sample-name",
  "code": "sample-code",
  "phone": "sample-phone",
  "address": "sample-address"
} as T)
    },
    errors: {},
    apiError: { value: null },
    isSubmitting: { value: false }
  })
}))

import { useAdminHotelForm } from '~/composables/admin-hotel/useAdminHotelForm'

describe('composables/admin-hotel/useAdminHotelForm', () => {
  const validForm = {
  "name": "sample-name",
  "code": "sample-code",
  "phone": "sample-phone",
  "address": "sample-address"
} as const

  beforeEach(() => {
    mockCreate.mockReset()
    mockPush.mockReset()
    mockNuxtApiFetch.mockReset()
    mockCreate.mockResolvedValue({ id: 1, ...validForm })
  })

  it('exposes empty initialValues for form fields', () => {
    const { initialValues } = useAdminHotelForm()

    expect(initialValues.name).toBe('')
    expect(initialValues.code).toBe('')
    expect(initialValues.phone).toBe('')
    expect(initialValues.address).toBe('')
  })

  it('onSubmit calls prototype mock create and navigates to list', async () => {
    const { onSubmit } = useAdminHotelForm()

    await onSubmit()

    expect(mockCreate).toHaveBeenCalledWith(validForm)
    expect(mockPush).toHaveBeenCalledWith('/admin/hotels')
  })
})
