import {handleErrors, log} from '@middlewares'
import {logger} from '@services'
import routes from './routes'
import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

let app
let webserver

export const initializeRoutes = (port: number) => {
  return new Promise<void>((resolve, reject) => {
    app = express()
    webserver = http.createServer(app)

    app.use(bodyParser.json())

    const listeningCallback = () => {
      logger.info(`Server listening on port ${port}`)
      app.use(log)
      app.use(routes)
      app.use(handleErrors)
      resolve()
    }

    // TODO: gestire errore di binding

    webserver.listen(port, listeningCallback)
  })
}

export const stopWebserver = () => {
  webserver.close()
}

export {app}

