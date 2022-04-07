import * as winston from 'winston'
import { loglevel as level } from '../../../configuration.json'
import { alignedWithTimestamp } from './format'

export const logger = winston.createLogger({
  level,
  format: alignedWithTimestamp,
  transports: [new winston.transports.Console()]
})
