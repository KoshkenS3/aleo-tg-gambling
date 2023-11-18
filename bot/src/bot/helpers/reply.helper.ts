import { ForceReply, InlineKeyboardMarkup, ReplyKeyboardMarkup, ReplyKeyboardRemove } from 'telegraf/types'
import { MixContext, MixContextUpdate } from '../interfaces'

export const botReply = async (
  ctx: MixContextUpdate | MixContext,
  messageArray: string[],
  reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply,
  replyToMessageId: number | undefined = undefined,
): Promise<void> => {
  try {
    const message = messageArray.join('\n')

    await ctx.reply(message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup,
      reply_to_message_id: replyToMessageId,
    })
  } catch (err) {
    console.warn(`Got error in botReply: ${err}`)
  }
}
