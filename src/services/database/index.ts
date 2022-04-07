import { createPool } from 'mysql2/promise'
import { database } from '../../../configuration.json'

export const db = createPool(database)
