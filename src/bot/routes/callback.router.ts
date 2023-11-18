import { BotCallbackEnum } from '../../enums'
import { playTelegramGameAndSendResult, sendGamesList, sendProfile } from '../controllers'
import { LangEnum, MixContextUpdateWithSession, TelegramGameTypeEnum } from '../interfaces'

export const botCallbackRouter = async (ctx: MixContextUpdateWithSession): Promise<void> => {
  const callbackData = ctx.update.callback_query?.data
  if (!callbackData) return

  switch (callbackData) {
    case BotCallbackEnum.sendTelegramGames: {
      sendGamesList(ctx)
      break
    }
    case BotCallbackEnum.sendProfile: {
      sendProfile(ctx)
      break
    }
    case BotCallbackEnum.telegramGameDice: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.dice)
      break
    }
    case BotCallbackEnum.telegramGameFootball: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.football)
      break
    }
    case BotCallbackEnum.telegramGameBasketball: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.basketball)
      break
    }
    case BotCallbackEnum.telegramGameDarts: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.darts)
      break
    }
    case BotCallbackEnum.telegramGameBowling: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.bowling)
      break
    }
    case BotCallbackEnum.telegramGameSlots: {
      playTelegramGameAndSendResult(ctx, TelegramGameTypeEnum.slots)
      break
    }
    default:
      return
  }
}
