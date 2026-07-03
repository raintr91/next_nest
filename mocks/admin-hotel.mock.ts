import type { AdminHotelListResponse } from '~/models/admin-hotel/admin-hotel.types'

const PAGE_SIZE = 100

const mockItemsPage1: Record<string, unknown>[] = [
  {
    "id": 1,
    "name": "Danh sách hotel admin A",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 2,
    "name": "Danh sách hotel admin B",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 3,
    "name": "Danh sách hotel admin C",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
]

const mockItemsPage2: Record<string, unknown>[] = [
  {
    "id": 101,
    "name": "Danh sách hotel admin A (page 2)",
    "managers": [
      {
        "id": 101,
        "full_name": "Manager A"
      }
    ]
  },
  {
    "id": 102,
    "name": "Danh sách hotel admin B (page 2)",
    "managers": [
      {
        "id": 102,
        "full_name": "Manager B"
      }
    ]
  },
  {
    "id": 103,
    "name": "Danh sách hotel admin C (page 2)",
    "managers": [
      {
        "id": 103,
        "full_name": "Manager C"
      }
    ]
  }
]

/** Prototype mock — ≥2 pages for pagination (portal-gen). */
export async function adminHotelMockSearch(
  query: Record<string, unknown>
): Promise<AdminHotelListResponse> {
  const page = Number(query.page ?? 1)
  const name = String(query.name ?? '').toLowerCase()

  let items = page <= 1 ? [...mockItemsPage1] : [...mockItemsPage2]
  if (name) {
    items = items.filter((row) => String(row.name ?? '').toLowerCase().includes(name))
  }

  return {
    items,
    total: mockItemsPage1.length + mockItemsPage2.length
  }
}

export const adminHotelMockPageSize = PAGE_SIZE

export async function adminHotelMockCreate(
  payload: Record<string, unknown>
): Promise<Record<string, unknown>> {
  return {
    id: 1001,
    ...payload,
    created_at: new Date().toISOString()
  }
}
