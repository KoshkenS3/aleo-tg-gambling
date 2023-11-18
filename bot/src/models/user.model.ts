import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserBalanceModel } from './balance.model'
import { UserSettingsModel } from './settings.model'
import { BetModel } from './bet.model'
import { UserStatsModel } from './stats.model'

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('increment')
  id!: number

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string

  @Column({
    name: 'telegram_id',
    type: 'numeric',
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
  telegramId!: number

  @OneToOne(() => UserBalanceModel, (userBalance) => userBalance.user, { nullable: false })
  balance!: UserBalanceModel

  @OneToOne(() => UserSettingsModel, (userSettings) => userSettings.user, { nullable: false })
  settings!: UserSettingsModel

  @OneToOne(() => UserStatsModel, (userStats) => userStats.user, { nullable: false })
  stats!: UserStatsModel

  @OneToMany(() => BetModel, (bet) => bet.user)
  bets!: BetModel[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'update_at' })
  updatedAt!: Date
}
