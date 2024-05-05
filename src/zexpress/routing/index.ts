import { Router } from 'express'
import type { NextFunction, RequestHandler, Request, Response } from 'express'
import { cwd } from 'process'

const extractPath = (path: string) => {
  const resolvedPath = `${__dirname.replace(cwd(), '')}/${path}`
  console.log('Extracted path', __dirname, path, resolvedPath)
  return resolvedPath
}

export const routers: Router[] = []

export class ChainableRouter<
  Q extends Request = Request,
  S extends Response = Response
> {
  private router: Router
  middlewares: Array<(req: Q, res: S, next: NextFunction) => any> = []
  constructor(router?: Router) {
    if (!router) router = Router()
    this.router = router
    routers.push(this.router)
  }

  pipe<R extends object, V extends Q = R & Q extends Q ? R & Q : never>(
    middleware: (req: Q, res: S) => R | Promise<R> | PromiseLike<R>
  ): ChainableRouter<V, S> {
    const chain = new ChainableRouter<V, S>()
    chain.middlewares = this.middlewares.concat(middleware)
    return chain
  }

  constructHandler(
    handler: (req: Q, res: S, next: NextFunction) => void
  ): RequestHandler {
    return (async (req: Q, res: S, next: NextFunction) => {
      for (const m of this.middlewares) {
        req = Object.assign(req, await m(req, res, next))
      }
      handler(req, res, next)
    }) as any as RequestHandler
  }

  private route(
    method:
      | 'all'
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'patch'
      | 'options'
      | 'head',
    path: string,
    handler: RequestHandler
  ) {
    if (!this.router) throw new Error('Router not initialized')
    const fullPath = extractPath(path)
    return (this.router[method] as any)(fullPath, handler)
  }

  get(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('get', path, this.constructHandler(handler))
  }

  post(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('post', path, this.constructHandler(handler))
  }

  put(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('put', path, this.constructHandler(handler))
  }

  patch(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('patch', path, this.constructHandler(handler))
  }

  delete(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('delete', path, this.constructHandler(handler))
  }

  head(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('head', path, this.constructHandler(handler))
  }

  options(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('options', path, this.constructHandler(handler))
  }

  all(path: string, handler: (req: Q, res: S, next: NextFunction) => void) {
    return this.route('all', path, this.constructHandler(handler))
  }
}
