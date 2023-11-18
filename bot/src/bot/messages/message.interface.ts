import { LangEnum } from '../interfaces'
import { MessagesConfig } from './message.config'

/**
 * Разделы сообщений
 */
export enum MessageConfigGroupEnum {
  message = 'message',
  gameMessage = 'gameMessage',
  button = 'button',
}

export const isMessageConfigGroupEnum = (value: string): value is MessageConfigGroupEnum => value in MessageConfigGroupEnum

export type LangEnumKeys = keyof typeof LangEnum
export type MessageConfigGroupEnumKeys = keyof typeof MessageConfigGroupEnum

export type IMessage = {
  params?: Record<string, string>
  message: {
    [lang in LangEnum]: string
  }
}

export type IMessagesConfig = {
  [key in MessageConfigGroupEnum]: Record<string, IMessage>
}

export type MessageParamsGeneric<
  T extends keyof typeof MessagesConfig,
  N extends keyof (typeof MessagesConfig)[T],
> = (typeof MessagesConfig)[T][N] extends IMessage ? Partial<(typeof MessagesConfig)[T][N]['params']> : never
