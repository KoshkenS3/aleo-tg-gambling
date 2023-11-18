import { MiddlewareFn } from 'telegraf'

import { MixContextUpdate } from '../interfaces'
import { ValidConfig } from '../../config'
import { createTelegramDataHash } from '../../utils'
import { auth } from '../services/auth.service'

export interface ITelegramData {
  id: number
  first_name: string
  last_name?: string
  is_premium: boolean
  username?: string
  language_code?: string
}

export const botSessionMiddleware: MiddlewareFn<MixContextUpdate> = async (ctx: MixContextUpdate, next) => {
  if (!ctx.from?.id || ctx.from?.is_bot) {
    next()
    return
  }

  const messageId = ctx.update.callback_query?.message?.message_id ?? ctx.message?.message_id

  if (!messageId) {
    next()
    return
  }

  if (ctx.session?.user) {
    ctx.session = {
      ...ctx.session,
      messageId,
    }
    next()
    return
  }

  const telegramData: ITelegramData = {
    id: ctx.from.id,
    first_name: ctx.from.first_name,
    is_premium: ctx.from.is_premium ?? false,
  }

  if (ctx.from.last_name) telegramData.last_name = ctx.from.last_name
  if (ctx.from.username) telegramData.username = ctx.from.username
  if (ctx.from.language_code) telegramData.language_code = ctx.from.language_code

  const user = await auth(telegramData)

  if (user instanceof Error) {
    console.log(`Error when auth user: ${user.message}`)
    next()
    return
  }

  ctx.session = {
    user: {
      id: user.id,
      name: user.name,
      telegramId: user.telegramId,
      balance: {
        amount: user.balance.amount,
      },
      settings: {
        globalBet: user.settings.globalBet,
      },
      createdAt: user.createdAt,
    },
    messageId,
  }

  next()
}
