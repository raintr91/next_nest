import { describe, expect, it } from 'vitest'

import { createChainHotelService } from '~/services/chain-hotel.service'
import { mockApiFetch } from '~/tests/unit/_helpers/mockApiFetch'

describe('services/chain-hotel.service export', () => {
  it('exportReport calls export endpoint with JSON envelope', async () => {
    const apiFetch = mockApiFetch({
      success: true,
      code: 200,
      message: 'OK',
      data: { ok: true },
      meta: null,
      trace_id: null
    })

    await createChainHotelService(apiFetch).exportReport({ month: '2025-05' })

    expect(apiFetch).toHaveBeenCalledWith('/hotels/export-report', {
      method: 'POST',
      body: { month: '2025-05' }
    })
  })
})
