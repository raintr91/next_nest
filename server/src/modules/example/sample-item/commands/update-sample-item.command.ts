export class UpdateSampleItemCommand {
  constructor(
    readonly id: number | string,
    readonly dto: Record<string, unknown>
  ) {}
}
