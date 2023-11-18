import { TelegramGameEmoji } from '../../config/config.const'
import { playTelegramGameAndSendResult } from '../controllers'
import { MixContextWithSession, TelegramGameTypeEnum } from '../interfaces'

export const botDiceRouter = async (ctx: MixContextWithSession): Promise<void> => {
  if (!ctx.session || !ctx.message.dice) {
    return
  }

  console.log(`botDiceRouter`, ctx.message.dice)

  const dice = ctx.message.dice
  const messageId = ctx.message.message_id

  Object.entries(TelegramGameEmoji).forEach(async ([key, value]) => {
    if (value === dice.emoji) {
      await playTelegramGameAndSendResult(ctx, key as TelegramGameTypeEnum, { ...dice, messageId })
    }
  })
}
