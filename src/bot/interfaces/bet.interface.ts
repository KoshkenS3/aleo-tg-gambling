import { BetStatusEnum } from './telegramGame.interface'

export interface IBetStartRequest {
  amount: number
  gameName: string
  gameStartData: Record<string, any>
  houseEdge: number
}

export interface IBetEndRequest {
  betId: number
  betResultStatus: BetStatusEnum.lose | BetStatusEnum.win
  // payoutAmount: number
  multiplier?: number
  gameEndData: Record<string, any>
  gameEndTime: Date
}
