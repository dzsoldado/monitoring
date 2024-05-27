const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "log.log",
      format: combine(
        timestamp(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} - ${level}: ${message}`;
        })
      )
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ],
});

module.exports = logger;