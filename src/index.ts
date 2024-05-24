import 'dotenv/config.js'
import { registerRouters, routers } from 'src/zexpress/routing'
import express from 'express'

const app: express.Application = express()
const port = process.env.PORT || 8000

app.use(express.json())

const main = async () => {
  await registerRouters().catch(console.error)
  console.log(
    '----------------------------------------------------------------'
  )
  routers.forEach((router) => {
    app.use(router.path, router.router)
    console.log('Mapped route:', router.path)
  })

  app.listen(port)
  console.log('Listening on port', port)
  console.log(
    '----------------------------------------------------------------'
  )
}

main()
