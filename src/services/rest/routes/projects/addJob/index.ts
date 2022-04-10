import {ErrorWithCode, Job} from '@entities'
import {result} from '../../../middlewares'
import {Req} from '@types'
import {Response, NextFunction} from 'express'
import moment from 'moment'

const checkParams = (req: Req, res: Response, next: NextFunction) => {
  if(req.body.creationDate && !moment.isMoment(moment(req.body.creationDate, 'YYYY-MM-DD HH:mm:ss'))) return next(new ErrorWithCode(`Wrong date format for 'creationDate' field`, 400))
  if(req.body.price === undefined || req.body.price === null) return next(new ErrorWithCode(`Missing 'price' job parameter in request body`, 400))
  if(isNaN(parseFloat(req.body.price))) return next(new ErrorWithCode(`Wrong value for job price`, 400))
  if(!req.body.status) return next(new ErrorWithCode(`Missing 'status' job parameter in request body`, 400))


  return next()
}

const addAndSaveJob = async (req: Req, res: Response, next: NextFunction) => {
  const {creationDate = moment().format('YYYY-MM-DD HH:mm:ss'), price, status} = req.body
  const job = new Job({creationDate, price, status})
  try {
    await req.payload.addJob(job)
  } catch (e) {
    return next(e)
  }

  return next()
}

export const addJob = [
  checkParams, addAndSaveJob, result
]
