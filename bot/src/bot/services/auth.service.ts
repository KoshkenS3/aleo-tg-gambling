import { UserModel } from '../../models'
import { createNewUser, getUserByTelegramUserId } from '../../repository/user.repository'
import { ITelegramData } from '../middleware'

export const auth = async (telegramData: ITelegramData): Promise<UserModel | Error> => {
  let user = await getUserByTelegramUserId(telegramData.id)

  if (!user) {
    const newUser = await createNewUser(telegramData)

    if (newUser instanceof Error) {
      return new Error(newUser.message)
    }

    console.log(newUser)

    user = newUser
  }

  return user
}
