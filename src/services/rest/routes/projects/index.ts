import {ErrorWithCode, Project} from '@entities'
import {NextFunction, Router} from 'express'
import {Req} from '@types'
import {addJob} from './addJob'
import {retrieve} from './retrieve'
import {create} from './create'

const router = Router()

router.param('id', async (req: Req, res: Response, next: NextFunction, id: string) => {
  try {
    req.payload = await Project.getById(parseInt(id))
  } catch (e) {
    return next(e)
  }

  if(!req.payload) return next(new ErrorWithCode(`Project not found`, 404))

  return next()
})

router.get('/:id?', retrieve)
router.post('/', create)
router.patch('/:id/jobs', addJob)


export default router
