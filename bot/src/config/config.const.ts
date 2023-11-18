import { CurrencyEnum } from '../bot/helpers'
import { TelegramGameTypeEnum } from '../bot/interfaces'

export const UNLOCK_PERCENT = 0.1

export const MINIMUM_BET: Record<CurrencyEnum, number> = {
  token: 50,
}

export const MAXIMUM_BET: Record<CurrencyEnum, number> = {
  token: 10000,
}

export const TelegramGameEmoji: Record<TelegramGameTypeEnum, string> = {
  [TelegramGameTypeEnum.dice]: '🎲',
  [TelegramGameTypeEnum.football]: '⚽',
  [TelegramGameTypeEnum.basketball]: '🏀',
  [TelegramGameTypeEnum.darts]: '🎯',
  [TelegramGameTypeEnum.bowling]: '🎳',
  [TelegramGameTypeEnum.slots]: '🎰',
}

export const TelegramGameHouseEdge: Record<TelegramGameTypeEnum, number> = {
  dice: 0,
  football: 10,
  basketball: 20,
  darts: 8.3,
  bowling: 8.3,
  slots: 21.8,
}

export const TelegramGameTimer: Record<TelegramGameTypeEnum, number> = {
  dice: 2900,
  football: 1600,
  basketball: 1600,
  darts: 2400,
  bowling: 1600,
  slots: 1600,
}
