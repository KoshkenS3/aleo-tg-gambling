import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm'

import { UserModel } from './user.model'

@Entity('user_stats')
export class UserStatsModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  //оборот
  @Column({
    name: 'wager',
    type: 'numeric',
    default: 0,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  wager!: number

  //оборот
  @Column({
    name: 'bet_count',
    type: 'int8',
    default: 0,
    transformer: {
      to(value) {
        return value
      },
      from(value) {
        return Number(value)
      },
    },
  })
  betCount!: number

  @Column({ name: 'user_id', unique: true })
  userId!: number

  @OneToOne(() => UserModel, (user) => user.stats, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user!: UserModel

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt!: Date
}
