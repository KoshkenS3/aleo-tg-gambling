export function calculateSourceValueByPercent(value: number, percent: number): number
export function calculateSourceValueByPercent(value: bigint, percent: bigint): bigint
export function calculateSourceValueByPercent(value: number | bigint, percent: number | bigint): number | bigint {
  if (typeof value === 'number' && typeof percent === 'number') {
    return value / ((100 - percent) / 100)
  } else if (typeof value === 'bigint' && typeof percent === 'bigint') {
    const hundred = BigInt(100)
    const percentDiff = hundred - percent
    const multiplier = percentDiff / hundred
    return value / multiplier
  } else {
    throw new Error('Invalid argument types in calculateSourceValueByPercent')
  }
}
