import {ErrorWithCode} from '@entities'
import { Request, Response, NextFunction } from 'express'
import { logger } from '@services'

export const handleErrors = (err: ErrorWithCode, req: Request, res: Response, next: NextFunction) => {
  logger.error(err)
  res.status(err.status || 500)

  return res.send(err.message)
}
