import { Job } from '@entities'
import { db } from '@services'
import {ResultSetHeader, RowDataPacket} from 'mysql2'
import {alignedWithTimestamp} from '../../services/logger/format'

export interface iProject {
  id?: number
  title: string
  jobs?: Job[]
}

export class Project {
  public id?: number
  public title: string
  public jobs: Job[]

  constructor(project: iProject) {
    this.id = project.id || null
    this.title = project.title
    this.jobs = project.jobs || []
  }

  public async save(): Promise<void> {
    let query: string
    const values: any[] = [this.title]

    if(this.id) {
      query = `UPDATE projects SET title = ? WHERE id = ?`
      values.push(this.id)
    } else {
      query = `INSERT INTO projects (title) VALUE (?)`
    }

    const [result] = await db.execute(query, values)

    if(!this.id) this.id = (result as ResultSetHeader).insertId

    // Salvataggio dei jobs
    // --> cancellazione job non più esistenti
    const deleteJobsQuery = `DELETE FROM jobs WHERE projectId = ? AND id NOT IN (?)`
    const deleteJobsValues = [this.id, this.jobs.map(job => job.id).join(', ')]
    await db.execute(deleteJobsQuery, deleteJobsValues)
    // --> salvataggio/aggiornamento job esistenti
    await Promise.all(this.jobs.map(job => job.save(this)))
  }
  public async delete(): Promise<void> {
    const query = `DELETE FROM projects WHERE id = ?`
    await db.execute(query, [this.id])
  }

  public async getJobs(): Promise<void> {
    this.jobs = await Job.getByProject(this)
  }
  public addJob(job: Job): Promise<void> {
    return  job.save(this)
  }

  static async getAll(): Promise<Project[]> {
    const query = `SELECT * FROM projects ORDER BY id ASC`
    const [results] = await db.execute(query)

    return Promise.all((results as iProject[]).map(async result => {
      const project = new Project(result)
      await project.getJobs()
      return project
    }))
  }

  static async getById(id: number): Promise<Project> {
    const query = `SELECT * FROM projects WHERE id = ?`
    const [results] = await db.execute(query, [id])

    if((results as iProject[]).length === 0) return null

    const project = new Project(results[0])
    await project.getJobs()
    return project
  }
}
