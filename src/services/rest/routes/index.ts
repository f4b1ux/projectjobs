import { Router } from 'express'
import projects from './projects'
import jobs from './jobs'

const router = Router()

router.use('/projects', projects)
router.use('/jobs', jobs)

export default router
