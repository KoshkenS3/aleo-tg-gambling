export enum CurrencyEnum {
  token = 'token',
}

export const CurrencyEmoji: Record<CurrencyEnum, string> = {
  [CurrencyEnum.token]: '💎',
}

export const coinsAliases = ['монеты', 'монет', 'монета', 'монету', 'token', 'tokens', 'coin', 'coins', CurrencyEmoji[CurrencyEnum.token]]
