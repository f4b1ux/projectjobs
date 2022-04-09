import {db} from '@services'
import {Job, Project} from '@entities'

import moment from 'moment'

const statuses = ['in preparation', 'in progress', 'delivered', 'cancelled']

export const jobsFactory = n => [...Array(n).keys()].map(_ => new Job({
  creationDate: moment().format('YYYY-MM-DD HH:mm:ss'),
  price: Math.round(Math.random() * 10 * 100) / 100,
  status: statuses[Math.floor(Math.random() * statuses.length)]
}))

export const projectsFactory = n => [...Array(n).keys()].map(k => new Project({
  title: `project${k}`,
  jobs: jobsFactory(Math.ceil(Math.random() * 5))
}))

export const initDB = async (): Promise<Project[]> => {
  // crea un numero random di progetti da 1 a 10
  const projectToSave = projectsFactory(Math.ceil(Math.random() * 10))
  await Promise.all(projectToSave.map(project => project.save()))
  return projectToSave
}

export const resetDB = async (): Promise<void> => {
  await db.execute(`DELETE FROM projects`)
  await db.execute(`ALTER TABLE projects AUTO_INCREMENT = 1`)
  await db.execute(`ALTER TABLE jobs AUTO_INCREMENT = 1`)
}
