# HANDOFF — Chain — danh sách hotel (施設一覧)

Generated from `docs/features/chain/hotel/chain-hotel-list.spec.yaml` (profile: **list**).

## Files

- `models/chain-hotel/chain-hotel.schema.ts`
- `models/chain-hotel/chain-hotel.types.ts`
- `models/chain-hotel/index.ts`
- `services/chain-hotel.service.ts`
- `composables/chain-hotel/useChainHotelList.ts`
- `pages/hotels/index.vue`
- `mocks/chain-hotel.mock.ts`

## Manual follow-up

- **override-shell**: ui.composition.overrideCommonPattern or pattern: custom — implement organism shell manually.
- **manual-composable** (`exportOpenRateReport`): Implement composable function: exportOpenRateReport
- **manual-composable** (`loginAsStoreManager`): Implement composable function: loginAsStoreManager
- **manual-composable** (`loginAsStoreManager`): Implement composable function: loginAsStoreManager
- **wire-only** (`login-as-store-handoff`): Defer until /wire: login-as-store-handoff
- **open-question**: Module Chain API (api workspace) chưa có route list — contract tạm theo legacy paginateHotels cho đến khi BE publish.

## Commands

```bash
pnpm docs:render
# after spec edits
pnpm portal:gen --spec ... --force  # re-generate
```
