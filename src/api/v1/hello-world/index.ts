import { validateProperty } from 'zexpress/validation'
import { CreateSocials } from './schema'
import { ChainableRouter } from 'zexpress/routing'

const chainableRouter = new ChainableRouter()

chainableRouter
  .pipe(validateProperty(CreateSocials, 'query'))
  .get('/hello', (req, res) => res.status(200).send(req.socials))
