import { StartApi } from './api'
import { StartBot } from './bot'
import { StartDB } from './db'
;(async () => {
  await StartBot()
  await StartApi()
  await StartDB()
  console.log(`Bot running`)
})()
