import Joi from '@hapi/joi'

export interface IConfig {
  BOT_LOGIN: string
  BOT_TOKEN: string
  DB_URL: string
  SIG_URL: string
  FRONT_URL: string
  CA_CERT?: string
}

export const configSchema = Joi.object<IConfig>({
  BOT_LOGIN: Joi.string().required(),
  BOT_TOKEN: Joi.string().required(),
  DB_URL: Joi.string().required(),
  SIG_URL: Joi.string().required(),
  FRONT_URL: Joi.string().required(),
  CA_CERT: Joi.string(),
})
