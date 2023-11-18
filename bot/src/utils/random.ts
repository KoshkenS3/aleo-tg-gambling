export const getRandomInt = (min: number, max: number): number => {
  if (min >= max) {
    return min
  }

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateNonceForSig = (): bigint => {
  return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) + (BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) << BigInt(32))
}
