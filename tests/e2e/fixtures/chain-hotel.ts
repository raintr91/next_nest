import type { ApiEnvelope } from '../helpers/session'
import { success } from '../helpers/session'

const listItemsPage1 = [
  {
    id: 1,
    name: 'Chain — danh sách hotel (施設一覧) A',
    managers: [{ id: 101, full_name: 'Manager A' }]
  },
  {
    id: 2,
    name: 'Chain — danh sách hotel (施設一覧) B',
    managers: [{ id: 102, full_name: 'Manager B' }]
  },
  {
    id: 3,
    name: 'Chain — danh sách hotel (施設一覧) C',
    managers: [{ id: 103, full_name: 'Manager C' }]
  }
]

export function chainHotelListSuccess(): ApiEnvelope<{
  items: typeof listItemsPage1
  total: number
}> {
  return success({
    items: listItemsPage1,
    total: listItemsPage1.length + 3
  })
}

export function chainHotelListWithManagerSuccess(): ApiEnvelope<{
  items: typeof listItemsPage1
  total: number
}> {
  return chainHotelListSuccess()
}

export function chainHotelExportReportSuccess(): ApiEnvelope<{ ok: boolean }> {
  return success({ ok: true })
}

export function storeLoginFromAdminSuccess(): ApiEnvelope<{
  token: string
  user_name: string
  hotel_name: string
  use_restaurant: boolean | null
  user_id: number
}> {
  return success({
    token: 'mock-store-token',
    user_name: 'Manager A',
    hotel_name: 'Chain — danh sách hotel (施設一覧) A',
    use_restaurant: false,
    user_id: 101
  })
}
