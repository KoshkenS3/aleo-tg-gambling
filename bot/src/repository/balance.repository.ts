import { DBConnection } from '../db'
import { OperatorEnum } from '../enums'
import { UserBalanceModel } from '../models'

const userBalanceRepo = DBConnection.getRepository(UserBalanceModel)

export const updateUserBalance = async (userId: number, operator: OperatorEnum, amount: number): Promise<UserBalanceModel | Error | null> => {
  try {
    let userBalance = await userBalanceRepo.findOne({ where: { userId } })

    if (!userBalance) {
      return null
    }

    if (amount <= 0) {
      return userBalance
    }

    const oldAmount: number = userBalance.amount
    let newAmount: number

    switch (operator) {
      case OperatorEnum.minus:
        newAmount = oldAmount - amount
        break
      case OperatorEnum.plus:
        newAmount = oldAmount + amount
        break
    }

    if (newAmount < 0) {
      return new Error(`User balance can't be less than 0`)
    }

    userBalance.amount = newAmount

    await userBalanceRepo.save(userBalance)

    userBalance = await userBalanceRepo.findOne({ where: { userId } })

    return userBalance
  } catch (err: any) {
    console.log(`Error when update user balance: ${err.message}`)
    return new Error(err.message)
  }
}
