import { Job } from '@entities'
import { db } from '@services'

export interface iProject {
  id?: number
  title: string
  jobs: Job[]
}

export class Project {
  public id?: number
  public title: string
  public jobs: Job[]

  constructor(project: iProject) {
    this.id = project.id || null
    this.title = project.title
    this.jobs = project.jobs
  }

  public async save() {
    //TODO
  }

  public async delete() {
    // TODO
  }
}
