import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, BaseEntity } from 'typeorm'

import { UserModel } from './user.model'

@Entity('user_settings')
export class UserSettingsModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({
    name: 'global_bet',
    default: 10,
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
  globalBet!: number

  @Column({ name: 'user_id', unique: true })
  userId!: number

  @OneToOne(() => UserModel, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user!: UserModel

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt!: Date
}
