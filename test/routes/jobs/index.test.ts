import {Job, Project} from '@entities'
import moment from 'moment'
import request from 'supertest'

import {initializePool, initializeRoutes, app, stopWebserver, closePool} from '@services'
import { database, api_port } from '../../configuration.json'
import {initDB, randomStatus, resetDB} from '../../db_init'

let projects: Project[]
let jobs: Job[]

describe('Jobs endpoints', () => {
  beforeAll(async () => {
    initializePool(database)
    await initializeRoutes(api_port)
  })
  beforeEach( async () => {
    await resetDB()
    projects = await initDB()
    jobs = projects.map(p => p.jobs).flat()
  })
  afterAll(() => {
    closePool()
    stopWebserver()
  })

  describe('GET /jobs', () => {
    it('Should return all jobs', async () => {
      const {status, body} = await request(app).get('/jobs')
      expect(status).toBe(200)

      expect(body.payload).toHaveLength(jobs.length)
      jobs.forEach(job => {
        expect(body.payload.find(j => j.id === job.id)).toBeDefined()
      })
    })
    it('Should return all jobs with a specific status', async () => {
      const rStatus = randomStatus()

      const {status, body} = await request(app).get(`/jobs?status=${rStatus}`)
      expect(status).toBe(200)

      const filteredJobs = jobs.filter(j => j.status === rStatus)
      expect(body.payload).toHaveLength(filteredJobs.length)

      filteredJobs.forEach(job => {
        expect(body.payload.find(j => j.id === job.id)).toBeDefined()
      })

    })
    it('Should return all jobs ordered by creationDate ASC', async () => {
      const {status, body} = await request(app).get('/jobs?sort=%2BcreationDate')
      expect(status).toBe(200)

      expect(body.payload).toHaveLength(jobs.length)

      body.payload.forEach((job, index) => {
        if(index !== body.payload.length - 1) {
          const curCreationDate = moment(job.creationDate)
          const nextCreationDate = moment(body.payload[index + 1].creationDate)

          expect(curCreationDate.isBefore(nextCreationDate)).toBe(true)
        }
      })
    })
    it('Should return all jobs ordered by creationDate DESC', async () => {
      const {status, body} = await request(app).get('/jobs?sort=-creationDate')
      expect(status).toBe(200)

      expect(body.payload).toHaveLength(jobs.length)

      body.payload.forEach((job, index) => {
        if(index !== body.payload.length - 1) {
          const curCreationDate = moment(job.creationDate)
          const nextCreationDate = moment(body.payload[index + 1].creationDate)

          expect(curCreationDate.isAfter(nextCreationDate)).toBe(true)
        }
      })
    })
  })

  describe('PATCH /jobs', () => {
    it('Should modify status of a job', async () => {
      const randomJob = jobs[Math.floor(Math.random() * jobs.length)]

      let newStatus: string
      do {
        newStatus = randomStatus()
      } while (randomJob.status !== newStatus)

      const {status, body} = await request(app).patch(`/jobs/${randomJob.id}/status`).send({status: newStatus})
      expect(status).toBe(200)
      expect(body.payload.id).toBe(randomJob.id)
      expect(body.payload.status).toBe(newStatus)
    })
  })
})
