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
