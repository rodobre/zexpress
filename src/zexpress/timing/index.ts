import type { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'
import onHeaders from 'on-headers'

export function responseTimeMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = performance.now()

  onHeaders(res, function () {
    const duration = performance.now() - start
    res.setHeader('X-Response-Time', `${duration.toFixed(3)}ms`)
  })

  next()
}
