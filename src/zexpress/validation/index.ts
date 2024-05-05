import { z } from 'zod'
import type { Request, Response } from 'express'
import { constants } from 'http2'

export const makeValidationError = (
  res: Response,
  {
    status,
    json,
  }: {
    status: number
    json: Record<string, unknown>
  }
) => {
  return res.status(status).json(json)
}

export const validateProperty = <T extends z.ZodObject<any, any, any>>(
  schema: T,
  propertyKey: 'params' | 'query' | 'body'
): ((req: Request, res: Response) => z.infer<T>) => {
  return async (req: Request, res: Response) => {
    const result = schema.safeParse(req[propertyKey])
    if (!result.success) {
      makeValidationError(res, {
        status: constants.HTTP_STATUS_BAD_REQUEST,
        json: { location: propertyKey, validationResult: result.error },
      })
      return {}
    }

    return result.data
  }
}
