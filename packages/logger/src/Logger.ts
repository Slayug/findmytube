import {format, createLogger, transports} from "winston";

const timestampFormat = format.printf(({ level, message, label, timestamp, stack }) => {
  let log = `${timestamp} [${label}] ${level}: ${message}`;
  if (stack) {
    // print log trace
    log = `${log} - ${stack}`
  }
  return log;
});

const packageName = process.env.npm_package_name;

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format.label({ label: packageName }),
    format.timestamp(),
    timestampFormat,
  ),
  defaultMeta: { service: packageName },
  transports: [
    new transports.Console(),
  ],
});


