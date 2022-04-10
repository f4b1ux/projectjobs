import {Project} from '@entities'
import {result} from '../../../middlewares'
import {Req} from '@types'
import {NextFunction} from 'express'

const getProjects = async (req: Req, res: Response, next: NextFunction) => {
  if(req.params.id) return next()

  try {
    req.payload = await Project.getAll()
  } catch (e) {
    return next(e)
  }

  return next()
}

export const retrieve = [
  getProjects, result
]
