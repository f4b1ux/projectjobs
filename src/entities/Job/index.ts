import { db } from '@services'
import {ResultSetHeader} from 'mysql2'
import {Project} from '../Project'
import moment from 'moment'

export interface iJob {
  id?: number
  creationDate: string
  price: number
  status: string
}

/**
 * Class to handle projects' jobs
 */
export class Job {
  public id: number
  public creationDate: string
  public price: number
  public status: string

  constructor(job: iJob) {
    this.id = job.id || null
    this.creationDate = moment(job.creationDate).format('YYYY-MM-DD HH:mm:ss')
    this.price = typeof job.price === 'string' ? parseFloat(job.price) : job.price
    this.status = job.status
  }

  /**
   * It save or update a job on database, referencing it to the project to which it belongs
   * @param project
   */
  public async save(project?: Project) {
    let query: string
    let values: any[]
    if(this.id) {
      query = `
            UPDATE jobs 
            SET 
                creationDate = ?, 
                price = ?, 
                status = ? 
            WHERE id = ?`
      values = [this.creationDate, this.price, this.status, this.id]
    } else {
      if(!project) throw new Error('Missing project')
      query = `INSERT INTO jobs (creationDate, price, status, projectId) VALUE (?, ?, ?, ?)`
      values = [this.creationDate, this.price, this.status, project.id]
    }

    const [result] = await db.execute(query, values)

    if(!this.id) this.id = (result as ResultSetHeader).insertId
  }

  /**
   * It delete a job from database
   */
  public async delete() {
    const query = `DELETE FROM jobs WHERE id = ?`
    return db.execute(query, [this.id])
  }

  /**
   * Returns all jobs of a project
   * @param project
   */
  static async getByProject(project: Project): Promise<Job[]> {
    const query = `SELECT id, creationDate, price, status FROM jobs WHERE projectId = ?`
    const [results] = await db.execute(query, [project.id])

    return (results as iJob[]).map(job => new Job(job))
  }

  /**
   * Returns all jobs
   */
  static async getAll(): Promise<Job[]> {
    const query = `SELECT * FROM jobs ORDER BY id ASC`
    const [results] = await db.execute(query)

    return (results as iJob[]).map(job => new Job(job))
  }

  /**
   * Returns a job by id
   * @param {number} id The job Id
   */
  static async getByID(id: number): Promise<Job> {
    const query = `SELECT * FROM jobs WHERE id = ?`
    const [result] = await db.execute(query, [id])

    if((result as iJob[]).length === 0) return null

    return new Job(result[0])
  }

  /**
   * Returns all jobs with specified state
   */
  static async getByStatus(status: string): Promise<Job[]> {
    const query = `SELECT * FROM jobs WHERE status = ? ORDER BY id`
    const [results] = await db.execute(query, [status])

    return (results as iJob[]).map(job => new Job(job))
  }

  /**
   * Returns all jobs ordered by creationDate, asc or desc
   */
  static async getAllSortedByCreationDate(mode: string): Promise<Job[]> {
    const query = `SELECT * FROM jobs ORDER BY creationDate ${mode}`
    const [results] = await db.execute(query)

    return (results as iJob[]).map(job => new Job(job))
  }
}
