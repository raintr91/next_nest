import { SampleItemResource } from './sample-item.resource'

describe('SampleItemResource', () => {
  it('maps contract keys', () => {
    const dto = SampleItemResource.toDto({
      id: 1,
      name: 'A',
      managers: [{ id: 2, full_name: 'M' }],
    })
    expect(dto.id).toBe(1)
    expect(dto.name).toBe('A')
    expect(dto.managers).toEqual([{ id: 2, full_name: 'M' }])
  })
})
