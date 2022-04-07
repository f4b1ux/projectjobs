import {logger} from '@services'
import {Request, Response, NextFunction} from 'express'

export const log = (req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.headers['x-real-ip'] || req.connection.remoteAddress} ${req.method} ${req.url}`)
  return next()
}
