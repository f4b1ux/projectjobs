import { db } from '@services'

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
    this.creationDate = job.creationDate
    this.price = job.price
    this.status = job.status
  }

  public async save() {
    // TODO
  }

  public async delete() {
    // TODO
  }
}
