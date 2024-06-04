import { validateProperty } from 'src/zexpress/validation'
import { SamplePostSchema } from './schema'
import { ChainableRouter } from 'src/zexpress/routing'

const chainableRouter = new ChainableRouter()

chainableRouter
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .post('/', (req, res) =>
    res
      .status(200)
      .send({ ...req.data.user, id: Math.floor(Math.random() * 1000000) })
  )

// Healthcheck
chainableRouter.get('/', (_, res) => {
  return res.status(200).send({ message: 'OK' })
})

// Explicitly cause a redirect
chainableRouter.get('/redirect', (_, res) => {
  return res
    .status(301)
    .setHeader('Location', 'https://google.com')
    .send({ message: 'OK' })
})

// Explicitly cause an error
chainableRouter.get('/error', (_, res) => {
  const a = { b: 1, c: 2 } as Record<string, any>
  return res.status(301).send(a[4].abc)
})
