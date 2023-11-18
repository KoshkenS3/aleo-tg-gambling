import { configSchema, IConfig } from './config.interface'
import dotenv from 'dotenv'

dotenv.config()

export const ValidConfig: IConfig = {
  BOT_LOGIN: process.env.BOT_LOGIN || '',
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  DB_URL: process.env.DB_URL || '',
  SIG_URL: process.env.SIG_URL || '',
  CA_CERT: process.env.CA_CERT,
  FRONT_URL: process.env.FRONT_URL || '',
}

const resultValidationConfig = configSchema.validate(ValidConfig)

if (resultValidationConfig.error) {
  console.error(`Validate config error: ${resultValidationConfig.error.message}`)
  process.exit(1)
}

console.log('Validate config')
