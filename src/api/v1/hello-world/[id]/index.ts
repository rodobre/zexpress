import { validateProperty } from 'src/zexpress/validation'
import { SamplePostSchema, SamplePutSchema } from '../schema'
import { ChainableRouter } from 'src/zexpress/routing'

const chainableRouter = new ChainableRouter()

chainableRouter
  .pipe(validateProperty(SamplePutSchema, 'params'))
  .pipe(validateProperty(SamplePostSchema, 'body'))
  .put('/', (req, res) => {
    res.status(200).send({ ...req.user, id: req.id })
  })
