import { validateProperty } from 'src/zexpress/validation'
import { SamplePostSchema, SamplePutSchema } from './schema'
import { ChainableRouter } from 'src/zexpress/routing'

const chainableRouter = new ChainableRouter()

chainableRouter
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .post('/', (req, res) =>
    res
      .status(200)
      .send({ ...req.user, id: Math.floor(Math.random() * 1000000) })
  )

chainableRouter
  .pipe(validateProperty(SamplePutSchema, 'params'))
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .put('/:id/', (req, res) => {
    res.status(200).send({ ...req.user, id: req.id })
  })
