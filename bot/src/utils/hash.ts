import { createHash, createHmac } from 'crypto'

export const createTelegramDataHash = (data: Record<string, any>, botToken: string): string => {
  const secret = createHash('sha256').update(botToken).digest()

  const array: string[] = []

  for (const key in data) {
    array.push(key + '=' + data[key])
  }

  const check_hash = createHmac('sha256', secret).update(array.sort().join('\n')).digest('hex')
  return check_hash
}
