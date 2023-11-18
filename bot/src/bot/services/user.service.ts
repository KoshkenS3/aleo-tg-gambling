import { UserModel } from '../../models'
import { getUserById, updateUserSettingsModel } from '../../repository'

export const updateUserSettings = async (userId: number, globalBet: number): Promise<UserModel | Error> => {
  const updatedUserSettings = await updateUserSettingsModel(userId, { globalBet })

  if (!updatedUserSettings) {
    return new Error(`updateUserSettingsModel error`)
  }

  const user = await getUserById(userId)

  if (!user) {
    return new Error(`getUserById error`)
  }

  return user
}
