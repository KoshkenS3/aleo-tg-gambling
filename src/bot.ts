import { Telegraf, session } from 'telegraf'

import { ValidConfig } from './config'
import { botSessionMiddleware } from './bot/middleware'
import { MixContext, MixContextUpdate, MixContextUpdateWithSession, MixContextWithSession } from './bot/interfaces'
import { botCallbackRouter, botCommandRouter, botDiceRouter, botMessageRouter } from './bot/routes'

export const StartBot = async (): Promise<void> => {
  try {
    const bot = new Telegraf(ValidConfig.BOT_TOKEN)

    bot.use(session())
    bot.use(botSessionMiddleware)
    bot.on('message', (ctx: MixContext) => {
      if (ctx.message.dice) {
        botDiceRouter(ctx as MixContextWithSession)
        return
      }

      const text = ctx.message.text
      if (!text) return

      if (text.startsWith('/')) {
        botCommandRouter(ctx as MixContextWithSession)
      } else {
        botMessageRouter(ctx as MixContextWithSession)
      }
    })

    bot.on('callback_query', (ctx: MixContextUpdate) => {
      botCallbackRouter(ctx as MixContextUpdateWithSession)
    })

    bot
      .launch()
      .then(() => {
        console.log(`Bot running`)
      })
      .catch((error) => {
        console.error(`Bot ${ValidConfig.BOT_LOGIN} initialization error`, error)
        process.exit(1)
      })
  } catch (e) {
    console.error('Ошибка бота: ', e)
  }
}
