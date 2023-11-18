import { ITelegramData } from '../bot/middleware'
import { DBConnection } from '../db'
import { UserBalanceModel, UserModel, UserSettingsModel, UserStatsModel } from '../models'

const userRepo = DBConnection.getRepository(UserModel)

export const getUserById = async (id: number): Promise<UserModel | null> => {
  return await userRepo.findOne({
    where: {
      id,
    },
    relations: ['balance', 'settings'],
  })
}

export const getUserByTelegramUserId = async (telegramId: number): Promise<UserModel | null> => {
  return await userRepo.findOne({
    where: {
      telegramId,
    },
    relations: ['balance', 'settings'],
  })
}

export const createNewUser = async (telegramData: ITelegramData): Promise<UserModel | Error> => {
  try {
    const user = await DBConnection.transaction(async (transactionalEntityManager) => {
      const name = telegramData.first_name ?? '' + telegramData.last_name ?? ''

      const user = await transactionalEntityManager.save(UserModel, { telegramId: telegramData.id, name })

      await transactionalEntityManager.save(UserBalanceModel, {
        user,
      })
      await transactionalEntityManager.save(UserSettingsModel, {
        user,
      })
      await transactionalEntityManager.save(UserStatsModel, {
        user,
      })
      return user
    })

    const createdUser = await getUserById(user.id)

    if (!createdUser) {
      return new Error("New user wasn't created")
    }

    return createdUser
  } catch (err: any) {
    console.log(`Error when create new user: ${err.message}`)
    return new Error(err.message)
  }
}
