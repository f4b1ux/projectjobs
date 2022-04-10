import {ErrorWithCode, Job} from '@entities'
import {result} from '@middlewares'
import {Req} from '@types'
import {Response, NextFunction} from 'express'

const getJobs = async (req: Req, res: Response, next: NextFunction) => {
  if(req.params.id) return next()

  let {status, sort} = req.query

  // If it's defined a status param in query string
  if(status) {
    try {
      req.payload = await Job.getByStatus(status)
    } catch (e) {
      return next(e)
    }

    return next()
  }

  // If is requested an ordening method on 'creationDate' field
  if(sort && sort.substring(1) === 'creationDate'){
    let sorting: string
    sort = decodeURIComponent(sort)
    switch (sort.substring(0, 1)){
      case '+':
        sorting = 'ASC'
        break
      case '-':
        sorting = 'DESC'
        break
      default:
        return next(new ErrorWithCode('You must specify a valid ordening method (+ for ASC and - for DESC)', 400))
    }

    // Otherwise
    try {
      req.payload = await Job.getAllSortedByCreationDate(sorting)
    } catch (e) {
      return next(e)
    }

    return next()
  }

  try {
    req.payload = await Job.getAll()
  } catch (e) {
    return next(e)
  }

  return next()
}

export const retrieve = [
  getJobs, result
]
