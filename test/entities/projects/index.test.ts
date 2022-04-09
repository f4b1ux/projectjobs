import {Project} from '@entities'
import {db, initializePool} from '@services'
import moment from 'moment'
import {initDB, resetDB, projectsFactory, jobsFactory} from '../../db_init'
import {sortById} from '../../helpers/sortById'

let projects: Project[]

describe('Project', () => {
  beforeAll( () => {
    initializePool({
      host: 'localhost',
      port: 3307,
      user: 'root',
      password: 'awesomeRootPassword',
      database: 'projectsjobs'
    })
  })
  beforeEach(async () => {
    await resetDB()
    projects = await initDB()
  })

  it('Should save all projects returned by initDb', async () => {
    const [projectsFromDB] = await db.execute(`SELECT * FROM projects ORDER BY id ASC`)

    expect(projectsFromDB).toHaveLength(projects.length)

    await Promise.all(projects.sort(sortById).map(async (project, index) => {
      expect(projectsFromDB[index].id).toBe(project.id)
      expect(projectsFromDB[index].title).toBe(project.title)

      const [jobs] = await db.execute(`SELECT * FROM jobs WHERE projectId = ? ORDER BY id`, [projectsFromDB[index].id])
      expect(jobs).toHaveLength(project.jobs.length)

      project.jobs.sort(sortById).forEach((job, index) => {
        expect(jobs[index].id).toBe(job.id)
        expect(moment(jobs[index].creationDate).format('YYYY-MM-DD HH:mm:ss')).toBe(job.creationDate)
        expect(parseFloat(jobs[index].price)).toBe(job.price)
        expect(jobs[index].status).toBe(job.status)
      })
    }))
  })

  it('Should get all projects from database', async () => {
    const projectsFromDB = await Project.getAll()

    expect(projectsFromDB).toHaveLength(projects.length)

    projects.sort(sortById).forEach((project, index) => {
      expect(project.id).toBe(projectsFromDB[index].id)
      expect(project.title).toBe(projectsFromDB[index].title)

      expect(project.jobs).toHaveLength(projectsFromDB[index].jobs.length)

      const orderedProjectJob = project.jobs.sort(sortById)
      const orderedDBProjectJob = projectsFromDB[index].jobs.sort(sortById)

      orderedProjectJob.forEach((job, index) => {
        const dbJob = orderedDBProjectJob[index]
        expect(job.id).toBe(dbJob.id)
        expect(job.creationDate).toBe(dbJob.creationDate)
        expect(job.price).toBe(dbJob.price)
        expect(job.status).toBe(dbJob.status)
      })
    })
  })

  it('Should get a project from db by id', async () => {
    const project = projects[Math.floor(Math.random() * projects.length)]

    const projectFromDB = await Project.getById(project.id)

    expect(projectFromDB.id).toBe(project.id)
    expect(projectFromDB.title).toBe(project.title)
    expect(projectFromDB.jobs).toHaveLength(project.jobs.length)

    const sortedJobsFromDB = projectFromDB.jobs.sort(sortById)
    const sortedJobs = project.jobs.sort(sortById)

    sortedJobsFromDB.forEach((dbJob, index) => {
      const job = sortedJobs[index]
      expect(job.id).toBe(dbJob.id)
      expect(job.creationDate).toBe(dbJob.creationDate)
      expect(job.price).toBe(dbJob.price)
      expect(job.status).toBe(dbJob.status)
    })
  })

  it('Should save a new project', async () => {
    const [project] = projectsFactory(1)
    await project.save()

    expect(project.id).toBeDefined()

    const [projectFromDB] = await db.execute(`SELECT * FROM projects WHERE id = ?`, [project.id])

    expect(projectFromDB).toHaveLength(1)
    expect(projectFromDB[0].id).toBe(project.id)
    expect(projectFromDB[0].title).toBe(project.title)

    const [jobsFromDB] = await db.execute(`SELECT id, creationDate, price, status FROM jobs WHERE projectId = ? ORDER BY id ASC`, [project.id])
    expect(jobsFromDB).toHaveLength(project.jobs.length)
    project.jobs.sort(sortById).forEach((job, index) => {
      expect(job.id).toBe(jobsFromDB[index].id)
      expect(job.creationDate).toBe(moment(jobsFromDB[index].creationDate).format('YYYY-MM-DD HH:mm:ss'))
      expect(job.price).toBe(parseFloat(jobsFromDB[index].price))
      expect(job.status).toBe(jobsFromDB[index].status)
    })
  })

  it('Should update an existing project', async () => {
    const project = projects[Math.floor(Math.random() * projects.length)]
    project.title = 'edited'
    project.jobs = jobsFactory(Math.ceil(Math.random() * 5))
    await project.save()

    const [projectFromDB] = await db.execute(`SELECT * FROM projects WHERE id = ?`, [project.id])
    expect(projectFromDB[0].title).toBe(project.title)

    const [jobsFromDB] = await db.execute(`SELECT id, creationDate, price, status FROM jobs WHERE projectId = ? ORDER BY id ASC`, [project.id])
    expect(jobsFromDB).toHaveLength(project.jobs.length)

    project.jobs.sort(sortById).forEach((job, index) => {
      expect(job.id).toBe(jobsFromDB[index].id)
      expect(job.creationDate).toBe(moment(jobsFromDB[index].creationDate).format('YYYY-MM-DD HH:mm:ss'))
      expect(job.price).toBe(parseFloat(jobsFromDB[index].price))
      expect(job.status).toBe(jobsFromDB[index].status)
    })
  })

  it('Should delete a project', async () => {
    const project = projects[Math.floor(Math.random() * projects.length)]
    await project.delete()

    const [results] = await db.execute(`SELECT * FROM projects WHERE id = ?`, [project.id])
    expect(results).toHaveLength(0)

    const [jobs] = await db.execute(`SELECT * FROM jobs WHERE projectId = ?`, [project.id])
    expect(jobs).toHaveLength(0)
  })
})

//https://stackoverflow.com/questions/62105729/run-jest-tests-in-docker-compose-with-mongodb-and-redis
