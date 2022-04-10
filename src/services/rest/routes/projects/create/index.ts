import {ErrorWithCode, Job, Project} from '@entities'
import {result} from '../../../middlewares'
import {Req} from '@types'
import {Response, NextFunction} from 'express'
import moment from 'moment'

const checkParams = (req: Req, res: Response, next: NextFunction) => {
  // Projects must have a title
  if(!req.body.title) return next(new ErrorWithCode(`Missing 'title' parameter in request body`, 400))
  // Projects must have at least one job
  if(!req.body.jobs || req.body.jobs.length === 0) return next(new ErrorWithCode(`Missing 'jobs' parameter in request body`, 400))

  // Every job must have at least a price and a status
  req.body.jobs.forEach(job => {
    if(job.creationDate && !moment.isMoment(moment(job.creationDate, 'YYYY-MM-DD HH:mm:ss'))) return next(new ErrorWithCode(`Wrong date format for 'creationDate' field`, 400))
    if(job.price === undefined || job.price === null) return next(new ErrorWithCode(`Missing 'price' job parameter in request body`, 400))
    if(isNaN(parseFloat(job.price))) return next(new ErrorWithCode(`Wrong value for job price`, 400))
    if(!job.status) return next(new ErrorWithCode(`Missing 'status' job parameter in request body`, 400))
  })

  return next()
}

const createProject = (req: Req, res: Response, next: NextFunction) => {
  req.payload = new Project({title: req.body.title})

  return next()
}

const save = async (req: Req, res: Response, next: NextFunction) => {
  try {
    await req.payload.save()
  } catch (e) {
    return next(e)
  }

  return next()
}

const addJobs = async (req: Req, res: Response, next: NextFunction) => {
  try {
    await Promise.all(req.body.jobs.map(async ({creationDate = moment().format('YYYY-MM-DD HH:mm:ss'), price, status}) => {
      const job = new Job({creationDate, price, status})
      return req.payload.addJob(job)
    }))
  } catch (e) {
    return next(e)
  }

  return next()
}

export const create = [
  checkParams, createProject, save, addJobs, result
]
