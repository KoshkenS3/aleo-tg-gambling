import { Dice } from 'telegraf/types'
import { BetStatusEnum, ITelegramGameResult, IUser, MixContextUpdate, TelegramGameTypeEnum } from '../interfaces'
import { TelegramGameEmoji } from '../../config/config.const'
import { IBetEndRequest, IBetStartRequest } from '../interfaces/bet.interface'
import { getUserById } from '../../repository/user.repository'
import { createBet, endBetModel, getBetById } from '../../repository/bet.repository'
import { BetModel } from '../../models'
import { addUserStatsAfterBet, updateUserBalance } from '../../repository'
import { OperatorEnum } from '../../enums'

export const sendDice = async (ctx: MixContextUpdate, gameType: TelegramGameTypeEnum): Promise<(Dice & { messageId: number }) | undefined> => {
  try {
    const botDiceMessage = await ctx.sendDice({
      emoji: TelegramGameEmoji[gameType],
    })

    const dice = botDiceMessage.dice

    if (dice) {
      return {
        ...dice,
        messageId: botDiceMessage.message_id,
      }
    } else {
      return
    }
  } catch (err) {
    return
  }
}

export const computingTelegramGameResult = (dice: Dice): ITelegramGameResult => {
  let multiplierTable: Record<number, number>

  switch (dice.emoji) {
    case TelegramGameEmoji.dice:
      multiplierTable = {
        4: 2,
        5: 2,
        6: 2,
      }
      break
    case TelegramGameEmoji.football:
      multiplierTable = {
        3: 1.5,
        4: 1.5,
        5: 1.5,
      }
      break
    case TelegramGameEmoji.basketball:
      multiplierTable = {
        4: 1.5, // не прямое попадение в корзину
        5: 2.5, // прямое попадение в корзину
      }
      break
    case TelegramGameEmoji.darts:
      multiplierTable = {
        4: 1,
        5: 1.5,
        6: 3,
      }
      break
    case TelegramGameEmoji.bowling:
      multiplierTable = {
        5: 0.5,
        6: 5,
      }
      break

    case TelegramGameEmoji.slots:
      multiplierTable = {
        2: 0.25, // 🍸🍸
        3: 0.25, // 🍸🍸
        4: 0.25, // 🍸🍸
        33: 0.25, // 🍸🍸
        49: 0.25, // 🍸🍸
        17: 0.25, // 🍸🍸
        27: 0.25, // 🍋🍋
        59: 0.25, // 🍋🍋
        42: 0.25, // 🍋🍋
        41: 0.25, // 🍋🍋
        11: 0.25, // 🍋🍋
        44: 0.25, // 🍋🍋
        6: 0.5, // 🍇🍇
        23: 0.5, // 🍇🍇
        24: 0.5, // 🍇🍇
        54: 0.5, // 🍇🍇
        38: 0.5, // 🍇🍇
        21: 0.5, // 🍇🍇
        16: 1, // 7️⃣7️⃣
        32: 1, // 7️⃣7️⃣
        61: 1, // 7️⃣7️⃣
        62: 1, // 7️⃣7️⃣
        63: 1, // 7️⃣7️⃣
        48: 1, // 7️⃣7️⃣
        1: 3, // 🍸🍸🍸
        43: 5, // 🍋🍋🍋
        22: 10, // 🍇🍇🍇
        64: 20, // 7️⃣7️⃣7️⃣
      }
      break
    default:
      multiplierTable = {}
  }

  const multiplier = multiplierTable[dice.value] || 0
  const status = multiplier > 0 ? BetStatusEnum.win : BetStatusEnum.lose

  return {
    multiplier,
    status,
  }
}

export const startBet = async (userId: number, startRequest: IBetStartRequest): Promise<BetModel | Error> => {
  const user = await getUserById(userId)

  if (!user) {
    return new Error(`Not found user by id ${userId}`)
  }

  const userBalance = await updateUserBalance(userId, OperatorEnum.minus, startRequest.amount)

  if (userBalance instanceof Error || !userBalance) {
    console.log(`Error update user balance in DB ${userBalance ? userBalance.message : ''}`)
    return new Error(`Error update user balance in DB ${userBalance ? userBalance.message : ''}`)
  }

  const houseProfit = Number((startRequest.amount * startRequest.houseEdge).toFixed(3))

  const bet = await createBet({
    userId: user.id,
    houseProfit,
    amount: startRequest.amount,
    gameName: startRequest.gameName,
    gameStartData: startRequest.gameStartData,
    houseEdge: startRequest.houseEdge,
  })

  if (bet instanceof Error) {
    console.log(
      `Error create bet ${bet.message} for user with id ${user.id} amount ${startRequest.amount} and gameName ${startRequest.gameName} and gameStartData ${startRequest.gameStartData}`,
    )
    return new Error(`Error create bet ${bet.message}`)
  }

  return bet
}

export const endBet = async (userId: number, endRequest: IBetEndRequest): Promise<BetModel | Error> => {
  const user = await getUserById(userId)

  if (!user) {
    return new Error(`Not found user by id ${userId}`)
  }

  const existBet = await getBetById(endRequest.betId)

  if (!existBet) {
    return new Error(`Not found bet by id ${endRequest.betId}`)
  }

  if (existBet.userId !== userId) {
    return new Error(`Bet with id ${endRequest.betId} not belong to user with id ${userId}`)
  }

  const nowDate = new Date()

  let payoutAmount: number

  switch (endRequest.betResultStatus) {
    case BetStatusEnum.win:
      const winAmount = Number((existBet.amount * endRequest.multiplier!).toFixed(3))
      payoutAmount = winAmount
      break
    case BetStatusEnum.lose:
      payoutAmount = 0
      break
    default:
      return new Error(`Unknown bet result status ${endRequest.betResultStatus}`)
  }

  //обновляем ставку
  const bet = await endBetModel(endRequest.betId, {
    payoutAmount,
    gameEndData: endRequest.gameEndData,
    status: endRequest.betResultStatus,
    multiplier: endRequest.multiplier!,
    gameEndTime: nowDate,
  })

  if (bet instanceof Error || !bet) {
    console.log(
      `Error update bet in DB ${bet ? bet.message : ''} for user with id ${userId} and betId ${endRequest.betId} and gameEndData ${
        endRequest.gameEndData
      } and gameEndTime ${nowDate} and payoutAmount ${payoutAmount} and status ${endRequest.betResultStatus} and multiplier ${endRequest.multiplier}`,
    )
    return new Error(`Error update bet in DB ${bet ? bet.message : ''}`)
  }

  if (endRequest.betResultStatus === BetStatusEnum.win) {
    const updatedUserBalanceResult = await updateUserBalance(user.id, OperatorEnum.plus, bet.payoutAmount!)
    if (updatedUserBalanceResult instanceof Error || !updatedUserBalanceResult) {
      console.log(`Error update user balance in DB ${updatedUserBalanceResult ? updatedUserBalanceResult.message : ''}`)
    }
  }

  //добавляем оборот в статистику пользователя
  await addUserStatsAfterBet(userId, bet.amount)

  return bet
}
