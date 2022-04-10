import {ErrorWithCode, Job} from '@entities'
import {Req} from '@types'
import {NextFunction, Response, Router} from 'express'
import {retrieve} from './retrieve'
import {updateStatus} from './updateStatus'

const router = Router()

router.param('id', async (req: Req, res: Response, next: NextFunction, id: string) => {
  try {
    req.payload = await Job.getByID(parseInt(id))
  } catch (e) {
    return next(e)
  }

  if(!req.payload) return next(new ErrorWithCode('Job not found', 404))

  return next()
})

router.get('/:id?', retrieve)
router.patch('/:id/status', updateStatus)

export default router
