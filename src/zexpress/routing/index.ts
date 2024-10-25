import { Router } from 'express'
import type { NextFunction, RequestHandler, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'fs'
import path from 'path'
import process from 'process'
import { accessLogger, errorLogger } from '../logging'
import { responseTimeMiddleware } from '../timing'

interface RouterPathTuple {
  router: Router
  path: string
}

export const routers: RouterPathTuple[] = []

const normalizeAPIPath = (registeredPath: string) => {
  function convertBracketsToColon(path: string): string {
    return path.replace(/\[([^\[\]]+)\]/g, ':$1').replace('/api/src', '')
  }

  return convertBracketsToColon(registeredPath)
}

export class ChainableRouter<
  Q extends Request = Request,
  S extends Response = Response
> {
  private router: Router
  middlewares: Array<(req: Q, res: S, next: NextFunction) => any> = []
  constructor(router?: Router) {
    if (!router) {
      router = Router({ mergeParams: true })
      this.router = router
      routers.push({ router: this.router, path: '' })
    } else {
      this.router = router
    }

    // Apply response time middleware to all routes
    this.router.use(responseTimeMiddleware)
  }

  pipe<R extends object, V extends Q = R & Q extends Q ? R & Q : never>(
    middleware: (req: Q, res: S) => R | Promise<R> | PromiseLike<R>
  ): ChainableRouter<V, S> {
    const chain = new ChainableRouter<V, S>(this.router)
    chain.middlewares = this.middlewares.concat(middleware)
    return chain
  }

  constructHandler(
    handler: (req: Q, res: S, next: NextFunction) => void
  ): RequestHandler {
    return (async (req: Q, res: S, next: NextFunction) => {
      let loggedAlready = false

      // Intercept the response methods
      const originalJson = res.json
      const originalSend = res.send
      const originalEnd = res.end

      const logResponse = () => {
        if (!loggedAlready) {
          accessLogger.info({
            method: req.method,
            httpVersion: req.httpVersion,
            httpStatus: res.statusCode,
            routePath: req.originalUrl,
            ip: req.ip,
          })
          loggedAlready = true
        }
      }

      res.json = function (body) {
        logResponse()
        return originalJson.call(this, body)
      }

      res.send = function (body) {
        logResponse()
        return originalSend.call(this, body)
      }

      try {
        for (const m of this.middlewares) {
          if (res.headersSent) return
          req = Object.assign(req, await m(req, res, next))
        }

        if (res.headersSent) return
        await handler(req, res, next)
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e))
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)

        errorLogger.error({
          method: req.method,
          httpVersion: req.httpVersion,
          httpStatus: res.statusCode,
          routePath: req.originalUrl,
          ip: req.ip,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          },
        })

        loggedAlready = true

        if (res.headersSent) return
        if (process.env.NODE_ENV === 'development') {
          return res.send({
            status: 'error',
            name: error.name,
            message: error.message,
            stack: error.stack,
            cause: error.cause,
          })
        } else {
          return res.send({ status: 'error', message: 'Internal Server Error' })
        }
      }
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
    return (this.router[method] as any)(path, handler)
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

const readdir = fs.readdirSync
const stat = fs.statSync

const stripUntilAPI = (filePath: string) => {
  const apiLoc = filePath.indexOf('/api')
  return apiLoc !== -1 ? path.dirname(filePath.slice(apiLoc)) : ''
}

export async function registerRouters() {
  const apiDir = path.join(process.cwd(), 'src', 'api')
  const dirs = await getDirectoriesRecursively(apiDir)

  // Sort directories alphabetically
  dirs.sort()

  for (const dir of dirs) {
    const indexPath = path.join(dir, 'index.ts')
    if (fs.existsSync(indexPath)) {
      await import(indexPath)
      routers[routers.length - 1].path = normalizeAPIPath(
        stripUntilAPI(indexPath)
      )
    }
  }
}

async function getDirectoriesRecursively(dir: string): Promise<string[]> {
  let dirs: string[] = []
  for (const file of readdir(dir)) {
    const filePath = path.join(dir, file)
    if (stat(filePath).isDirectory()) {
      dirs.push(filePath)
      const subDirs = await getDirectoriesRecursively(filePath)
      dirs = dirs.concat(subDirs)
    }
  }
  return dirs
}
