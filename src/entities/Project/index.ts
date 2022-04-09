import { Job } from '@entities'
import { db } from '@services'
import {ResultSetHeader} from 'mysql2'

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

  /**
   * Save or update the project on database
   */
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

  /**
   * Delete the project from database.
   * Also jobs are deleted because they have a foreign key to project.
   */
  public async delete(): Promise<void> {
    const query = `DELETE FROM projects WHERE id = ?`
    await db.execute(query, [this.id])
  }

  /**
   * Get project's jobs from db and set on project
   */
  public async getJobs(): Promise<void> {
    this.jobs = await Job.getByProject(this)
  }

  /**
   * Add a new job to project
   * @param job
   */
  public addJob(job: Job): Promise<void> {
    return  job.save(this)
  }

  /**
   * Return all projects
   */
  static async getAll(): Promise<Project[]> {
    const query = `SELECT * FROM projects ORDER BY id ASC`
    const [results] = await db.execute(query)

    return Promise.all((results as iProject[]).map(async result => {
      const project = new Project(result)
      await project.getJobs()
      return project
    }))
  }

  /**
   * Return a project by id
   * @param id
   */
  static async getById(id: number): Promise<Project> {
    const query = `SELECT * FROM projects WHERE id = ?`
    const [results] = await db.execute(query, [id])

    if((results as iProject[]).length === 0) return null

    const project = new Project(results[0])
    await project.getJobs()
    return project
  }
}
