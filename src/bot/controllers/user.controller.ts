import axios from 'axios'

import { MessageConfigGroupEnum, getMessageByLanguage } from '../messages'
import { MixContextWithSession, MixContextUpdateWithSession, LangEnum } from '../interfaces'
import { BotCallbackEnum, OperatorEnum } from '../../enums'
import { ValidConfig } from '../../config'
import { botReply } from '../helpers'
import { generateNonceForSig } from '../../utils'
import { getUserById, updateUserBalance } from '../../repository'
import { Markup } from 'telegraf'

export const sendStartMessage = async (ctx: MixContextWithSession): Promise<void> => {
  const { user } = ctx.session

  const startMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'start', LangEnum.en)

  botReply(ctx, [startMessage], {
    inline_keyboard: [
      [
        {
          callback_data: BotCallbackEnum.sendTelegramGames,
          text: getMessageByLanguage(MessageConfigGroupEnum.button, 'sendTelegramGame', LangEnum.en),
        },
      ],
      [
        {
          callback_data: BotCallbackEnum.sendProfile,
          text: getMessageByLanguage(MessageConfigGroupEnum.button, 'sendProfile', LangEnum.en),
        },
      ],
    ],
  })
}

export const sendProfile = async (ctx: MixContextUpdateWithSession): Promise<void> => {
  const { user, messageId } = ctx.session

  const profileMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'profile', LangEnum.en, {
    // wager: user.stats.wagerUsd.toString(),
    // betCount: user.stats.betCount.toString(),
    balance: user.balance.amount.toString(),
    createDate: new Date(user.createdAt).toLocaleDateString(),
  })

  botReply(ctx, [profileMessage], undefined, messageId)
}

export const cashOut = async (ctx: MixContextWithSession): Promise<void> => {
  const { user: userInfo, messageId } = ctx.session

  const text = ctx.message.text!

  const messageParts = text.split(' ')

  const amount = Number(messageParts[1])

  if (isNaN(amount) || amount <= 0) {
    const setBetInfoMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'cashOutInfo', LangEnum.en)
    botReply(ctx, [setBetInfoMessage], undefined, messageId)
    return
  }

  const user = await getUserById(userInfo.id)

  if (!user) {
    console.log(`getUserById in cashOut error  ${amount}`)
    return
  }

  if (user.balance.amount < amount) {
    const notEnoughBalanceMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'cashOutWarning', LangEnum.en, {
      amount: user.balance.amount.toString(),
    })

    botReply(ctx, [notEnoughBalanceMessage], undefined, messageId)
    return
  }

  const nonce = generateNonceForSig()
  const bigIntAmount = BigInt((amount * 10 ** 6).toFixed(0))

  const signature = await getSig(bigIntAmount, nonce)

  if (signature instanceof Error) {
    console.log(`getSig in cashOut error  ${signature}`)
    return
  }

  const newUserBalance = await updateUserBalance(user.id, OperatorEnum.minus, amount)

  if (!newUserBalance || newUserBalance instanceof Error) {
    console.log(`updateUserBalance in cashOut error  ${amount}`)
    return
  }

  const cashOutMessage = getMessageByLanguage(MessageConfigGroupEnum.message, 'cashOut', LangEnum.en, {
    amount: amount.toString(),
    balance: newUserBalance.amount.toString(),
  })

  botReply(
    ctx,
    [cashOutMessage],
    { inline_keyboard: [[{ url: `${ValidConfig.FRONT_URL}?nonce=${nonce}&amount=${bigIntAmount}&signature=${signature}`, text: 'Open mint site' }]] },
    messageId,
  )
}

const getSig = async (amount: bigint, nonce: bigint): Promise<string | Error> => {
  try {
    const url = `${ValidConfig.SIG_URL}/default/aleo-signer-v2?amount=${amount}&nonce=${nonce}`
    console.log(url)

    const response = await axios.get(url)

    return response.data
  } catch (err: any) {
    // Обработка ошибки и возвращение сообщения об ошибке
    return new Error(`GetSig error: ${err}`)
  }
}
