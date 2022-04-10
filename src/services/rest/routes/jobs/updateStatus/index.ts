import {ErrorWithCode} from '@entities'
import {result} from '@middlewares'
import {Req} from '@types'
import {Response, NextFunction} from 'express'

const checkParams = (req: Req, res: Response, next: NextFunction) => {
  const {status} = req.body

  if(!status || !['in preparation', 'in progress', 'delivered', 'cancelled'].includes(status))
    return next(new ErrorWithCode('Invalid status', 400))

  return next()
}

const update = async (req: Req, res: Response, next: NextFunction) => {
  req.payload.status = req.body.status

  try {
    await req.payload.save()
  } catch (e) {
    return next(e)
  }

  return next()
}

export const updateStatus = [
  checkParams, update, result
]
