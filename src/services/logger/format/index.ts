import moment from 'moment'
import { TransformableInfo, format } from 'logform'

interface iLogInfo extends TransformableInfo{
  timestamp: number
  level: string
  message: string
  data?: object
}

const logFormat = ({timestamp, level, message, data}: iLogInfo): string => {
  let logString = `${moment(timestamp).format('YYYY-MM-DD HH:mm:ss')} - ${level.toUpperCase()} - ${message}`

  if(data) logString += ` - data: ${JSON.stringify(data)}`

  return logString
}

export const alignedWithTimestamp = format.combine(
  format.splat(),
  format.timestamp(),
  format.align(),
  format.printf(logFormat)
)
