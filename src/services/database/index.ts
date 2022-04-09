import { createPool, Pool } from 'mysql2/promise'

let db: Pool

export const initializePool = conf => {
  db = createPool(conf)
}

export { db }
