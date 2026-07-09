import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
// Relation sync: @portal/models/sample-item/sample-item.relationships.meta

@Entity('sample_items')
export class SampleItemEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', nullable: true })
  name!: string | null

  @Column({ type: 'timestamp', nullable: true })
  created_at!: Date | null

  @Column({ type: 'timestamp', nullable: true })
  updated_at!: Date | null

  // hasMany → User (managers) — wire repository + syncRelation
}
