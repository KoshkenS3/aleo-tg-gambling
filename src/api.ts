import express from 'express'

const PORT = 8080

export const StartApi = async (): Promise<void> => {
  const app = express()

  app.get('/', (req, res) => {
    res.send('OK')
  })

  app.listen(PORT, () => {
    console.log(`Api for health check is running on port ${PORT}`)
  })
}
