import { ITelegramData } from '../bot/middleware'
import { DBConnection } from '../db'
import { UserBalanceModel, UserModel, UserSettingsModel } from '../models'

const userSettingsRepo = DBConnection.getRepository(UserSettingsModel)

export const updateUserSettingsModel = async (userId: number, updateData: Partial<UserSettingsModel>): Promise<UserSettingsModel | null> => {
  const updateResult = await userSettingsRepo.update({ userId }, updateData)
  if (updateResult.affected && updateResult.affected > 0) {
    return await userSettingsRepo.findOneBy({ userId })
  } else {
    return null
  }
}
