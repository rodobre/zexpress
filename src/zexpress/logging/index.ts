import winston from 'winston'
import 'winston-daily-rotate-file'
import * as path from 'path'
import * as fs from 'fs'

const { combine, timestamp, printf, colorize } = winston.format

const httpStatusColorizer = winston.format((info) => {
  const statusCode = info.message?.httpStatus
  if (statusCode >= 200 && statusCode < 300) {
    info.level = 'info'
  } else if (statusCode >= 300 && statusCode < 400) {
    info.level = 'debug'
  } else if (statusCode >= 400 && statusCode < 500) {
    info.level = 'warn'
  } else if (statusCode >= 500 && statusCode < 600) {
    info.level = 'error'
  }
  return info
})

const zexpressFormat = printf(({ level, message, timestamp }) => {
  const colorizedStatus = colorize().colorize(level, message.httpStatus)
  const formattedTimestamp = new Date(timestamp)
    .toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(',', '')

  let errorMessage = 'Error:\n'
  let hasError = Object.prototype.hasOwnProperty.call(message, 'error')

  if (hasError) {
    errorMessage += JSON.stringify(message.error, null, 2)
  }

  return `[${formattedTimestamp}] [${message.ip}] ${colorizedStatus} - ${
    message.method
  } ${message.routePath} HTTP/${message.httpVersion}${
    hasError ? ', ' + errorMessage : ''
  }`
})

const zexpressFileLogFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = new Date(timestamp)
    .toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(',', '')

  let errorMessage = 'Error:\n'
  let hasError = Object.prototype.hasOwnProperty.call(message, 'error')

  if (hasError) {
    errorMessage += JSON.stringify(message.error, null, 2)
  }

  return `[${formattedTimestamp}] [${message.ip}] ${message.httpStatus} - ${
    message.method
  } ${message.routePath} HTTP/${message.httpVersion}${
    hasError ? ', ' + errorMessage : ''
  }`
})

const logDir = 'logs'

if (!fs.existsSync(path.join(process.cwd(), logDir))) {
  fs.mkdirSync(path.join(process.cwd(), logDir))
}

const getLogFolderPath = (file: string) =>
  path.join(process.cwd(), logDir, file + '.log')

const accessLogger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), httpStatusColorizer(), zexpressFormat),
    }),
    new winston.transports.File({
      filename: getLogFolderPath('access'),
      level: 'info',
      format: combine(timestamp(), zexpressFileLogFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: getLogFolderPath(path.join('daily', '%DATE%-access')),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: combine(timestamp(), zexpressFileLogFormat),
    }),
  ],
})

const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), zexpressFileLogFormat),
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), httpStatusColorizer(), zexpressFormat),
    }),
    new winston.transports.File({
      filename: getLogFolderPath('error'),
      level: 'error',
      format: combine(timestamp(), zexpressFileLogFormat),
    }),
    new winston.transports.DailyRotateFile({
      filename: getLogFolderPath(path.join('daily', '%DATE%-error')),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: combine(timestamp(), zexpressFileLogFormat),
    }),
  ],
})

export { accessLogger, errorLogger }
