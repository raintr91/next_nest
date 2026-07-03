import { useApiForm } from '~/composables/forms/useApiForm'
import { createAdminHotelService } from '~/services/admin-hotel.service'
import { adminHotelCreateSchema } from '~/validations/admin-hotel/schemas'
import type { AdminHotelCreateRequest } from '~/models/admin-hotel/admin-hotel.types'
import { adminHotelMockCreate } from '~/mocks/admin-hotel.mock'

export function useAdminHotelForm() {
  const { $apiFetch } = useNuxtApp()
  const service = createAdminHotelService($apiFetch)
  const router = useRouter()

  const initialValues: AdminHotelCreateRequest = {
    name: '',
    code: '',
    phone: '',
    address: '',
  }

  const { onSubmit, errors, apiError, isSubmitting } = useApiForm<AdminHotelCreateRequest>({
    validationSchema: adminHotelCreateSchema,
    initialValues,
    submit: async (values) => {
      // Prototype mock — use service.create on /wire
      await adminHotelMockCreate(values)
      await router.push('/admin/hotels/create'.replace(/\/create$/, '') || '/')
    }
  })

  return { onSubmit, errors, apiError, isSubmitting, initialValues, service }
}
