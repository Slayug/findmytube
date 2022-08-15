import {format, createLogger, transports} from "winston";

const timestampFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const packageName = process.env.npm_package_name;

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: packageName }),
    format.timestamp(),
    timestampFormat
  ),
  defaultMeta: { service: packageName },
  transports: [
    new transports.Console(),
  ],
});


