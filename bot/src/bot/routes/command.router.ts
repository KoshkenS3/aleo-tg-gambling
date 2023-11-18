import { BotCommandEnum } from '../../enums'
import { MixContextWithSession } from '../interfaces'
import { cashOut, sendGamesList, sendProfile, sendStartMessage, setBet } from '../controllers'

export const botCommandRouter = async (ctx: MixContextWithSession): Promise<void> => {
  if (!ctx.message.text || !ctx.session) {
    return
  }

  const commandRegEx = /\/\w+/ // Регулярное выражение для поиска строки, начинающейся с '/'
  const matchResult = ctx.message.text.match(commandRegEx)

  const command = matchResult ? matchResult[0] : ''

  switch (command) {
    case BotCommandEnum.start: {
      sendStartMessage(ctx)
      break
    }
    case BotCommandEnum.games: {
      sendGamesList(ctx)
      break
    }
    case BotCommandEnum.set_bet: {
      setBet(ctx)
      break
    }
    case BotCommandEnum.profile: {
      sendProfile(ctx)
      break
    }
    case BotCommandEnum.cash_out: {
      cashOut(ctx)
      break
    }
    default:
      return
  }
}
