import { MixContextWithSession } from '../interfaces'

export const botMessageRouter = async (ctx: MixContextWithSession): Promise<void> => {
  if (!ctx.message.text || !ctx.session) {
    return
  }

  const messageText = ctx.message.text

  switch (messageText) {
    default:
      return
  }
}
