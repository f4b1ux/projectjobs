import {Request} from 'express'

export type Req = Request & {
  payload: any | any[]
}
