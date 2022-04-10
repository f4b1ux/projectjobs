import {Req} from '@types'
import {Response} from 'express'

export const result = (req: Req, res: Response) => {
  return res.send({payload: req.payload})
}

export const resultOK = (req: Request, res: Response) => {
  return res.sendStatus(200)
}
