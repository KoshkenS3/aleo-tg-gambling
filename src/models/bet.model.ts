import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, BaseEntity } from 'typeorm'

import { UserModel } from './user.model'
import { BetStatusEnum } from '../bot/interfaces'

@Entity('bet')
export class BetModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 10,
    scale: 3,
    nullable: true,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  amount!: number

  @Column({ name: 'game_name' })
  gameName!: string

  @Column({ name: 'game_start_data', type: 'json' })
  gameStartData!: Record<string, any>

  @Column({ name: 'game_end_data', type: 'json', nullable: true })
  gameEndData?: Record<string, any>

  @Column({
    name: 'payout_amount',
    type: 'numeric',
    precision: 10,
    scale: 3,
    nullable: true,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  payoutAmount?: number

  @Column({ name: 'status', type: 'enum', default: BetStatusEnum.new, enum: BetStatusEnum })
  status!: BetStatusEnum

  @Column({
    name: 'multiplier',
    type: 'numeric',
    precision: 10,
    scale: 3,
    nullable: true,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  multiplier?: number

  @Column({
    name: 'house_profit',
    type: 'numeric',
    default: 0,
    precision: 10,
    scale: 3,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  houseProfit!: number

  @Column({
    name: 'house_edge',
    type: 'numeric',
    default: 0,
    precision: 10,
    scale: 3,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  houseEdge!: number

  @Column({ name: 'user_id' })
  userId!: number

  @ManyToOne(() => UserModel, (user) => user.bets)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: UserModel

  @Column({ name: 'game_end_time', type: 'timestamp', nullable: true })
  gameEndTime?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
