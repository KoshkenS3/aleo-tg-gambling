import { BotCallbackEnum } from '../../enums'
import { CurrencyEmoji, CurrencyEnum, botReply } from '../helpers'
import { MixContextWithSession, MixContextUpdateWithSession, TelegramGameTypeEnum, LangEnum } from '../interfaces'
import { MessageConfigGroupEnum, getMessageByLanguage } from '../messages'
import { computingTelegramGameResult, endBet, sendDice, startBet } from '../services'
import { wait } from '../../utils'
import { Dice } from 'telegraf/types'
import { TelegramGameEmoji, TelegramGameHouseEdge, TelegramGameTimer } from '../../config/config.const'
import { IBetEndRequest, IBetStartRequest } from '../interfaces/bet.interface'
import { IBetEndData, endBetModel, getUserById } from '../../repository'
import { BetModel } from '../../models'

export const sendGamesList = async (ctx: MixContextUpdateWithSession): Promise<void> => {
  const { user, messageId } = ctx.session

  const gameListMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'gamesList', LangEnum.en)

  botReply(
    ctx,
    [gameListMessage],
    {
      inline_keyboard: [
        [
          {
            callback_data: BotCallbackEnum.telegramGameDice,
            text: TelegramGameEmoji.dice,
          },
          {
            callback_data: BotCallbackEnum.telegramGameFootball,
            text: TelegramGameEmoji.football,
          },
          {
            callback_data: BotCallbackEnum.telegramGameBasketball,
            text: TelegramGameEmoji.basketball,
          },
          {
            callback_data: BotCallbackEnum.telegramGameDarts,
            text: TelegramGameEmoji.darts,
          },
          {
            callback_data: BotCallbackEnum.telegramGameBowling,
            text: TelegramGameEmoji.bowling,
          },
          {
            callback_data: BotCallbackEnum.telegramGameSlots,
            text: TelegramGameEmoji.slots,
          },
        ],
      ],
    },
    messageId,
  )
}

export const playTelegramGameAndSendResult = async (
  ctx: MixContextUpdateWithSession,
  gameType: TelegramGameTypeEnum,
  dice?: Dice & { messageId: number },
): Promise<void> => {
  const { user: userFromSession, messageId } = ctx.session

  const user = await getUserById(userFromSession.id)

  if (!user) {
    console.warn('getUser error in playTelegramGameAndSendResult')
    return
  }

  const globalBet = user.settings.globalBet

  if (globalBet > user.balance.amount) {
    const notEnoughBalanceMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'betBalanceWarning', LangEnum.en, {
      amount: user.balance.amount.toString(),
      globalBet: globalBet.toString(),
    })

    botReply(ctx, [notEnoughBalanceMessage], undefined, messageId)
    return
  }

  const startBetRequest: IBetStartRequest = {
    gameName: `telegram-game-${gameType}`,
    amount: globalBet,
    gameStartData: {
      gameType,
    },
    houseEdge: TelegramGameHouseEdge[gameType],
  }

  let bet: BetModel | Error | null = await startBet(user.id, startBetRequest)

  if (bet instanceof Error) {
    botReply(ctx, ['startBet  error'], undefined, messageId) //TODO: добавить сообщение об ошибках
    return
  }

  if (!dice) {
    dice = await sendDice(ctx, gameType)

    if (!dice) {
      botReply(ctx, ['Send dice error'], undefined, messageId) //TODO: добавить сообщение об ошибках
      return
    }
  }

  const gameResult = computingTelegramGameResult(dice)

  console.log(gameResult)

  const endBetRequest: IBetEndRequest = {
    gameEndData: gameResult,
    betResultStatus: gameResult.status,
    betId: bet.id,
    gameEndTime: new Date(),
    multiplier: gameResult.multiplier!,
  }

  bet = await endBet(user.id, endBetRequest)

  if (bet instanceof Error || !bet) {
    botReply(ctx, ['endBet  error'], undefined, messageId) //TODO: добавить сообщение об ошибках
    return
  }

  const updatedUser = await getUserById(userFromSession.id)

  if (!updatedUser) {
    console.warn('getUser error in playTelegramGameAndSendResult')
  } else {
    ctx.session.user = updatedUser
  }

  const balance = updatedUser?.balance.amount || 0

  let resultMessage: string
  let gameResultMessage: string
  let balanceResultMessage: string

  if (gameResult.status === 'win') {
    resultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'gameWin', LangEnum.en, {
      username: user.name,
      amount: bet.payoutAmount?.toString(),
      currencyIcon: CurrencyEmoji[CurrencyEnum.token],
      gameEmoji: TelegramGameEmoji[gameType],
    })

    balanceResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'gameBalanceWin', LangEnum.en, {
      amount: bet.payoutAmount?.toString(),
      currencyIcon: CurrencyEmoji[CurrencyEnum.token],
      balance: balance.toString(),
      multiplier: bet.multiplier!.toString(),
    })
  } else {
    resultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'gameLose', LangEnum.en, {
      username: user.name,
      amount: bet.amount.toString(),
      currencyIcon: CurrencyEmoji[CurrencyEnum.token],
      gameEmoji: TelegramGameEmoji[gameType],
    })
    balanceResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'gameBalanceLose', LangEnum.en, {
      balance: balance.toString(),
      currencyIcon: CurrencyEmoji[CurrencyEnum.token],
    })
  }

  switch (gameType) {
    case TelegramGameTypeEnum.dice:
      if (gameResult.status === 'win') {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDiceWin', LangEnum.en, {
          luckyNumber: dice.value.toString(),
        })
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDiceLose', LangEnum.en, {
          luckyNumber: dice.value.toString(),
        })
      }
      break
    case TelegramGameTypeEnum.football:
      if (gameResult.status === 'win') {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameFootballWin', LangEnum.en)
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameFootballLose', LangEnum.en)
      }
      break
    case TelegramGameTypeEnum.basketball:
      if (gameResult.status === 'win') {
        if (dice.value === 5) {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBasketballWinCleanShot', LangEnum.en)
        } else {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBasketballWinNearCenter', LangEnum.en)
        }
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBasketballLose', LangEnum.en)
      }
      break
    case TelegramGameTypeEnum.darts:
      if (gameResult.status === 'win') {
        if (dice.value === 4) {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDartsWinNearCenter', LangEnum.en)
        } else if (dice.value === 5) {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDartsWinAlmostCenter', LangEnum.en)
        } else {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDartsWinCenter', LangEnum.en)
        }
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameDartsLose', LangEnum.en)
      }
      break
    case TelegramGameTypeEnum.bowling:
      if (gameResult.status === 'win') {
        if (dice.value === 5) {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBowlingWinOnePinLeft', LangEnum.en)
        } else {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBowlingWinStrike', LangEnum.en)
        }
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameBowlingLose', LangEnum.en)
      }
      break
    case TelegramGameTypeEnum.slots:
      if (gameResult.status === 'win') {
        if (bet.multiplier! < 2) {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameSlotsWinGoodCombo', LangEnum.en)
        } else {
          gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameSlotsWinGreatCombo', LangEnum.en)
        }
      } else {
        gameResultMessage = getMessageByLanguage(MessageConfigGroupEnum.gameMessage, 'telegramGameSlotsLose', LangEnum.en)
      }
      break
    default:
      gameResultMessage = ''
      break
  }

  const waitTimer = TelegramGameTimer[gameType]

  await wait(waitTimer)

  botReply(
    ctx,
    [resultMessage, gameResultMessage, '', balanceResultMessage],
    {
      inline_keyboard: [
        [
          {
            callback_data: BotCallbackEnum.telegramGameDice,
            text: TelegramGameEmoji.dice,
          },
          {
            callback_data: BotCallbackEnum.telegramGameFootball,
            text: TelegramGameEmoji.football,
          },
          {
            callback_data: BotCallbackEnum.telegramGameBasketball,
            text: TelegramGameEmoji.basketball,
          },
          {
            callback_data: BotCallbackEnum.telegramGameDarts,
            text: TelegramGameEmoji.darts,
          },
          {
            callback_data: BotCallbackEnum.telegramGameBowling,
            text: TelegramGameEmoji.bowling,
          },
          {
            callback_data: BotCallbackEnum.telegramGameSlots,
            text: TelegramGameEmoji.slots,
          },
        ],
      ],
    },
    dice.messageId,
  )
}
