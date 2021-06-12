import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'sessions',
})
export class Session {
  @PrimaryGeneratedColumn()
  id: string

  @Index()
  @Column('bigint', { default: Date.now() })
  expiredAt: number

  @Index()
  @Column('varchar')
  sid: string

  @Column('text')
  json: any
}