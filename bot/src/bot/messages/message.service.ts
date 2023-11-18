import { LangEnum } from '../interfaces'
import { MessagesConfig, ValidMessagesConfig } from './message.config'
import { MessageParamsGeneric, isMessageConfigGroupEnum } from './message.interface'

/**
 * Получение сообщения на выбраном языке
 *
 * @param groupName - группа сообщения 'message' | 'button'
 * @param messageName - название сообщения
 * @param lang - язык сообщения из LangEnum
 *
 * @param params - параметры в сообщении
 */
export const getMessageByLanguage = <G extends keyof typeof MessagesConfig, M extends keyof (typeof MessagesConfig)[G]>(
  groupName: G,
  messageName: M,
  lang: LangEnum,
  params?: MessageParamsGeneric<G, M>,
): string => {
  if (!isMessageConfigGroupEnum(groupName)) {
    return ''
  }

  const messageObj = ValidMessagesConfig[groupName][messageName]

  const defaultParams = messageObj.params

  let message = messageObj.message[lang]

  if (defaultParams) {
    if (!params) {
      params = defaultParams as MessageParamsGeneric<G, M>
    } else {
      for (const key in defaultParams) {
        if (!(key in params)) {
          const paramsKey = key as keyof MessageParamsGeneric<G, M>
          params[paramsKey] = defaultParams[key] as MessageParamsGeneric<G, M>[keyof MessageParamsGeneric<G, M>]
        }
      }
    }

    for (const key in params) {
      const regexp = new RegExp(`\\$\\{${key}\\}`, 'g')

      const value = Number.isNaN(Number(params[key])) ? (params[key] as string) : Number(params[key]).toLocaleString()

      message = message.replace(regexp, value)
    }
  }

  return message
}
