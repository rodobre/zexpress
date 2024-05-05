import 'dotenv/config.js'
import { registerRouters, routers } from 'src/zexpress/routing'
import express from 'express'

const app: express.Application = express()
const port = process.env.PORT || 8000

app.use(express.json())

const main = async () => {
  await registerRouters().catch(console.error)
  routers.forEach((router) => {
    app.use(router.path, router.router)
    console.log('Mapped routes for path', router.path)
  })

  app.listen(port)
  console.log('Listening on port', port)
}

main()
