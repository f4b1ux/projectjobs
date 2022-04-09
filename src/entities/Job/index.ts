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

  public async save(project: Project) {
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
      query = `INSERT INTO jobs (creationDate, price, status, projectId) VALUE (?, ?, ?, ?)`
      values = [this.creationDate, this.price, this.status, project.id]
    }

    const [result] = await db.execute(query, values)

    if(!this.id) this.id = (result as ResultSetHeader).insertId
  }

  public async delete() {
    const query = `DELETE FROM jobs WHERE id = ?`
    return db.execute(query, [this.id])
  }

  static async getByProject(project: Project): Promise<Job[]> {
    const query = `SELECT id, creationDate, price, status FROM jobs WHERE projectId = ?`
    const [results] = await db.execute(query, [project.id])

    return (results as iJob[]).map(job => new Job(job))
  }

}
