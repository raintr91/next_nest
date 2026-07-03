import { describe, expect, it } from 'vitest'

import { createAdminHotelService } from '~/services/admin-hotel.service'
import { mockApiFetch } from '~/tests/unit/_helpers/mockApiFetch'

describe('services/admin-hotel.service create', () => {
  const validPayload = {
  "name": "sample-name",
  "code": "sample-code",
  "phone": "sample-phone",
  "address": "sample-address"
} as const
  const createdRow = {
    id: 1,
    ...validPayload,
    created_at: '2026-01-01T00:00:00.000Z'
  }

  it('create calls create endpoint with body and parses response', async () => {
    const apiFetch = mockApiFetch({
      success: true,
      data: createdRow
    })

    const result = await createAdminHotelService(apiFetch).create(validPayload)

    expect(apiFetch).toHaveBeenCalledWith('/hotels', {
      method: 'POST',
      body: validPayload
    })
    expect(result).toEqual(createdRow)
  })
})
