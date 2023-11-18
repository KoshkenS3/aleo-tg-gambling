import { Context } from 'telegraf'
import { Dice, Message, Update } from 'telegraf/types'

export enum LangEnum {
  ru = 'ru',
  en = 'en',
}

export type MixContext = Context & {
  message: {
    text?: string
    dice?: Dice
  }
  session?: ISession
}

export interface MixContextUpdateWithSession extends MixContextUpdate {
  session: ISession
}

export interface MixContextWithSession extends MixContext {
  session: ISession
}

export type MixContextUpdate = Context<Update> & {
  message?: (Update.New & Update.NonChannel & Message & { text?: string; dice?: Dice }) | undefined
  session?: ISession
  update: {
    callback_query?: {
      game_short_name?: string
      data?: string
      message?: {
        message_id?: number
        text?: string
        reply_markup?: {
          inline_keyboard?: Array<any>
        }
      }
    }
  }
}

export interface IUserBalance {
  amount: number
}

export interface IUserSettings {
  globalBet: number
}

export interface IUser {
  id: number
  name: string
  telegramId: number
  balance: IUserBalance
  settings: IUserSettings
  createdAt: Date
}

export interface ISession {
  user: IUser
  messageId: number
}
