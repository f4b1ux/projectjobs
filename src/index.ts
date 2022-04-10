import { api_port, database } from '../configuration.json'
import { logger, initializePool, initializeRoutes } from '@services'

const main = async () => {

  // Database pool init
  initializePool(database)

  // Rest API init
  await initializeRoutes(api_port)

  logger.debug('Service ready')
}

main().catch(logger.error)
