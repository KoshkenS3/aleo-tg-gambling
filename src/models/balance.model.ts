import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserModel } from './user.model'

@Entity('user_balance')
export class UserBalanceModel {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({
    name: 'amount',
    default: 100,
    type: 'numeric',
    precision: 10,
    scale: 0,
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

  @Column({ name: 'user_id', unique: true })
  userId!: number

  @OneToOne(() => UserModel, (user) => user.balance, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user!: UserModel

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt!: Date
}
