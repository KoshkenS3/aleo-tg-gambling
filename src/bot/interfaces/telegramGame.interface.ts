export enum BetStatusEnum {
  new = 'new',
  win = 'win',
  lose = 'lose',
}

export interface ITelegramGameResult {
  multiplier: number
  status: BetStatusEnum.lose | BetStatusEnum.win
}

export enum TelegramGameTypeEnum {
  dice = 'dice',
  football = 'football',
  basketball = 'basketball',
  darts = 'darts',
  bowling = 'bowling',
  slots = 'slots',
}
