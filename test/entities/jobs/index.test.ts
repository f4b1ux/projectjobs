import {Job, Project} from '@entities'
import { initializePool, db } from '@services'
import moment from 'moment'
import { database } from '../../configuration.json'
import {initDB, randomStatus, resetDB} from '../../db_init'
import {sortById} from '../../helpers/sortById'

let projects: Project[]
let jobs: Job[]

describe('Jobs', () => {
  beforeAll(() => initializePool(database))
  beforeEach( async () => {
    await resetDB()
    projects = await initDB()
    jobs = projects.map(p => p.jobs).flat()
  })

  it('Should save all jobs of projects returned by initDB', async () => {
    const query = `SELECT * FROM jobs ORDER BY id ASC`
    const [jobsFromDB] = await db.execute(query)

    expect(jobsFromDB).toHaveLength(jobs.length)

    jobs.sort(sortById).forEach((job, index) => {
      const jobFromDB = jobsFromDB[index]

      expect(jobFromDB.id).toBe(job.id)
      expect(moment(jobFromDB.creationDate).format('YYYY-MM-DD HH:mm:ss')).toBe(job.creationDate)
      expect(parseFloat(jobFromDB.price)).toBe(job.price)
      expect(jobFromDB.status).toBe(job.status)
    })
  })

  it('Should get all jobs from database', async () => {
    const jobsFromDB = await Job.getAll()

    expect(jobsFromDB).toHaveLength(jobs.length)

    jobs.forEach(job => {
      const jobFromDB = jobsFromDB.find(j => j.id === job.id)

      expect(jobFromDB).toBeDefined()
      expect(jobFromDB.creationDate).toBe(job.creationDate)
      expect(jobFromDB.price).toBe(job.price)
      expect(jobFromDB.status).toBe(job.status)
    })
  })

  it('Should get a job by id', async () => {
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)]

    const jobFromDB = await Job.getByID(randomJob.id)

    expect(jobFromDB).toBeTruthy()
    expect(jobFromDB.id).toBe(randomJob.id)
    expect(jobFromDB.creationDate).toBe(randomJob.creationDate)
    expect(jobFromDB.price).toBe(randomJob.price)
    expect(jobFromDB.status).toBe(randomJob.status)
  })

  it('Should update status of a job', async () => {
    const job = jobs[Math.floor(Math.random() * jobs.length)]

    let newStatus

    do {
      newStatus = randomStatus()
    } while (newStatus === job.status)

    job.status = newStatus
    await job.save()

    // Retrieve saved data from database
    const [result] = await db.execute(`SELECT status FROM jobs WHERE id = ?`, [job.id])

    expect(result[0].status).toBe(newStatus)
  })

  it('Should get all jobs with a specified status', async () => {
    const status = randomStatus()

    const jobsWithStatus = jobs.filter(job => job.status === status)

    const jobsFromDB = await Job.getByStatus(status)

    expect(jobsFromDB).toHaveLength(jobsWithStatus.length)

    jobsWithStatus.sort(sortById).forEach(job => {
      const jobFromDB = jobsFromDB.find(j => j.id === job.id)

      expect(jobFromDB).toBeTruthy()
    })
  })

  it('Should get all jobs ordered by creationDate ASC', async () => {
    const jobsFromDB = await Job.getAllSortedByCreationDate('asc')

    expect(jobsFromDB).toHaveLength(jobs.length)

    jobsFromDB.forEach((job, index) => {
      if(index !== jobsFromDB.length - 1){
        const curCreationDate = moment(job.creationDate)
        const nextCreationDate = moment(jobsFromDB[index + 1].creationDate)

        expect(curCreationDate.isBefore(nextCreationDate)).toBe(true)
      }
    })
  })

  it('Should get all jobs ordered by creationDate DESC', async () => {
    const jobsFromDB = await Job.getAllSortedByCreationDate('desc')

    expect(jobsFromDB).toHaveLength(jobs.length)

    jobsFromDB.forEach((job, index) => {
      if(index !== jobsFromDB.length - 1){
        const curCreationDate = moment(job.creationDate)
        const nextCreationDate = moment(jobsFromDB[index + 1].creationDate)

        expect(curCreationDate.isAfter(nextCreationDate)).toBe(true)
      }
    })
  })
})
