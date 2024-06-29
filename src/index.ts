import 'dotenv/config.js'
import { registerRouters, routers } from 'src/zexpress/routing'
import express from 'express'
import { executeGraph } from 'decision-engine'
import { graph } from 'decision-engine/testGraph'

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

  console.log('Result', await executeGraph(graph, { helloe: 'world' }))
}

main()
