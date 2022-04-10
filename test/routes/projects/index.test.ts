import {Project} from '@entities'
import request from 'supertest'
import {initializePool, initializeRoutes, app, stopWebserver, closePool} from '@services'
import { database, api_port } from '../../configuration.json'
import {initDB, jobsFactory, projectsFactory, resetDB} from '../../db_init'

let projects: Project[]

describe('Projects Endpoint', () => {
  beforeAll(async () => {
    initializePool(database)
    await initializeRoutes(api_port)
  })
  beforeEach( async () => {
    await resetDB()
    projects = await initDB()
  })
  afterAll(() => {
    closePool()
    stopWebserver()
  })

  describe('GET /projects', () => {
    it('Should return an array of projects', async () => {
      const {status, body} = await request(app).get('/projects')
      expect(status).toBe(200)
      expect(body.payload).toHaveLength(projects.length)

      projects.forEach(project => {
        const projectFromEndpoint = body.payload.find(el => el.id === project.id)

        expect(projectFromEndpoint).toBeDefined()

        expect(projectFromEndpoint.title).toBe(project.title)
        expect(projectFromEndpoint.jobs).toHaveLength(project.jobs.length)
      })
    })
    it('Should return a project by id', async () => {
      const randomProject = projects[Math.floor(Math.random() * projects.length)]

      const {status, body} = await request(app).get(`/projects/${randomProject.id}`)
      expect(status).toBe(200)

      expect(body.payload.id).toBe(randomProject.id)
      expect(body.payload.title).toBe(randomProject.title)
      expect(body.payload.jobs).toHaveLength(randomProject.jobs.length)
    })
  })

  describe('POST /projects', () => {
    it('Should create a new project', async () => {
      const [project] = projectsFactory(1)

      const {status, body} = await request(app)
        .post('/projects/')
        .send(project)

      expect(status).toBe(200)

      expect(body.payload.id).toBeDefined()
      expect(body.payload.title).toBe(project.title)
      expect(body.payload.jobs).toHaveLength(project.jobs.length)
      body.payload.jobs.forEach(job => expect(job.id).toBeDefined())
    })
  })

  describe('PATCH /projects', () => {
    it('Should add a job to an existing project', async () => {
      const randomProject = projects[Math.floor(Math.random() * projects.length)]
      const [newJob] = jobsFactory(1)

      const {status, body} = await request(app).patch(`/projects/${randomProject.id}/jobs`).send(newJob)
      expect(status).toBe(200)

      expect(body.payload.jobs).toHaveLength(randomProject.jobs.length + 1)
    })
  })
})
