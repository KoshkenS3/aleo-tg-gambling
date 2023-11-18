import { MixContextWithSession, LangEnum } from '../interfaces'

import { CurrencyEmoji, CurrencyEnum, botReply, coinsAliases } from '../helpers'
import { MessageConfigGroupEnum, getMessageByLanguage } from '../messages'
import { updateUserSettingsModel } from '../../repository'

export const setBet = async (ctx: MixContextWithSession): Promise<void> => {
  let { user: userInfo, messageId } = ctx.session

  const text = ctx.message.text!

  const messageParts = text.split(' ')

  const amount = Number(messageParts[1])

  if (isNaN(amount) || amount <= 0) {
    const setBetInfoMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'setBetInfo', LangEnum.en)
    botReply(ctx, [setBetInfoMessage], undefined, messageId)
    return
  }

  const updatedUser = await updateUserSettingsModel(userInfo.id, { globalBet: amount })

  if (!updatedUser) {
    console.warn(`updateUserSettings in setBet error  ${amount}`)
    return
  }

  ctx.session.user = {
    ...userInfo,
    settings: {
      ...userInfo.settings,
      globalBet: amount,
    },
  }

  const setBetResultMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'setBetResult', LangEnum.en, {
    amount: updatedUser.globalBet.toString() ?? '',
    currencyIcon: CurrencyEmoji[CurrencyEnum.token],
  })

  botReply(ctx, [setBetResultMessage], undefined, messageId)
}
