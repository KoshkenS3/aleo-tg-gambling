import { BetModel } from '../models'
import { DBConnection } from '../db' // Предполагается, что DBConnection настроен аналогично вашему примеру
import { BetStatusEnum } from '../bot/interfaces'

const betRepo = DBConnection.getRepository(BetModel)

export interface IBetCreateData {
  amount: number
  gameName: string
  gameStartData: Record<string, any>
  houseEdge: number
  houseProfit: number
  userId: number
}

export interface IBetEndData {
  gameEndData: Record<string, any>
  payoutAmount: number
  multiplier: number
  gameEndTime: Date
  status: BetStatusEnum.lose | BetStatusEnum.win
}

export interface IPaginationParams {
  skip: number
  take: number
}

export interface IPaginationResult<T> {
  data: T[]
  total: number
}

export const createBet = async (createData: IBetCreateData): Promise<BetModel | Error> => {
  try {
    const bet = await betRepo.save(
      {
        amount: createData.amount,
        gameName: createData.gameName,
        gameStartData: createData.gameStartData,
        houseEdge: createData.houseEdge,
        houseProfit: createData.houseProfit,
        userId: createData.userId,
      },
      { reload: true },
    )

    const formattedBet = await getBetById(bet.id)
    return formattedBet ?? bet
  } catch (err: any) {
    console.error(`Error when create new bet: ${err.message}`)
    return new Error(err.message)
  }
}

export const endBetModel = async (betId: number, endBetData: IBetEndData): Promise<BetModel | Error | null> => {
  try {
    const bet = await getBetById(betId)

    if (!bet) {
      return null
    }

    if (bet.status !== BetStatusEnum.new) {
      return new Error(`Bet with id ${betId} already ended`)
    }

    const updateResult = await betRepo.update(betId, endBetData)

    if (updateResult.affected && updateResult.affected > 0) {
      return await getBetById(betId)
    } else {
      return new Error(`Bet with id ${betId} not found`)
    }
  } catch (err: any) {
    console.error(`Error when end bet: ${err.message}`)
    return new Error(err.message)
  }
}

export const getBetById = async (betId: number): Promise<BetModel | null> => {
  return await betRepo.findOne({
    where: {
      id: betId,
    },
  })
}

export const getActiveBetsByUserId = async (userId: number): Promise<BetModel[]> => {
  return await betRepo.find({
    where: {
      userId,
      status: BetStatusEnum.new,
    },
  })
}

export const getBetsByUserId = async (userId: number, paginationParams?: IPaginationParams): Promise<IPaginationResult<BetModel>> => {
  const bets = await betRepo.find({
    where: {
      userId,
    },
    order: {
      createdAt: 'DESC',
    },
    skip: paginationParams?.skip,
    take: paginationParams?.take,
  })

  const totalBets = await betRepo.count({
    where: {
      userId,
    },
  })

  return {
    data: bets,
    total: totalBets,
  }
}
