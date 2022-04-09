import {db} from '@services'
import {Job, Project} from '@entities'
import moment from 'moment'

const statuses = ['in preparation', 'in progress', 'delivered', 'cancelled']

/**
 * Returns a random element from statuses array
 */
export const randomStatus = () => statuses[Math.floor(Math.random() * statuses.length)]

/**
 * Returns a random date (moment) between from (or 1 year ago) and now
 * @param {moment.Moment} from Start date
 */
export const randomDate = (from?: moment.Moment): moment.Moment => {
  const start = from ?? moment().subtract(1, 'year')
  return moment(start.valueOf() + Math.random() * (moment().valueOf() - start.valueOf()))
}

/**
 * Returns n randomly created jobs
 * @param {number} n Number of jobs to create
 */
export const jobsFactory = (n: number) => [...Array(n).keys()].map((_) => new Job({
  creationDate: randomDate().format('YYYY-MM-DD HH:mm:ss'),
  price: Math.round(Math.random() * 10 * 100) / 100,
  status: randomStatus()
}))

/**
 * Returns n randomly created projects
 * @param {number} n Number of projects to create
 */
export const projectsFactory = (n: number) => [...Array(n).keys()].map(k => new Project({
  title: `project${k}`,
  jobs: jobsFactory(Math.ceil(Math.random() * 5))
}))

/**
 * Function to initialize test database.
 * It creates a random number of projects (with a random number of jobs for each) and save them in database.
 */
export const initDB = async (): Promise<Project[]> => {
  // crea un numero random di progetti da 1 a 10
  const projectToSave = projectsFactory(Math.ceil(Math.random() * 10))
  await Promise.all(projectToSave.map(project => project.save()))
  return projectToSave
}

/**
 * Delete all elements from database and reset auto increment value of tables
 */
export const resetDB = async (): Promise<void> => {
  await db.execute(`DELETE FROM projects`)
  await db.execute(`ALTER TABLE projects AUTO_INCREMENT = 1`)
  await db.execute(`ALTER TABLE jobs AUTO_INCREMENT = 1`)
}
