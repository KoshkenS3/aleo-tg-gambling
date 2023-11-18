import { DBConnection } from '../db'
import { UserStatsModel } from '../models'

const userStatsRepo = DBConnection.getRepository(UserStatsModel)

export const addUserStatsAfterBet = async (userId: number, amount: number): Promise<UserStatsModel | Error | null> => {
  try {
    let userStats = await userStatsRepo.findOne({ where: { userId } })

    if (!userStats) {
      return null
    }

    if (amount <= 0) {
      return userStats
    }

    userStats.wager = userStats.wager + amount

    userStats.betCount = userStats.betCount + 1

    await userStatsRepo.save(userStats)

    userStats = await userStatsRepo.findOne({ where: { userId } })

    return userStats
  } catch (err: any) {
    console.log(`Error when create new user: ${err.message}`)
    return new Error(err.message)
  }
}
