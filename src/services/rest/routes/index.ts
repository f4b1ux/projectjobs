import { Router } from 'express'
import projects from './projects'

const router = Router()

// TODO
// router.use('/jobs')
router.use('/projects', projects)

export default router
