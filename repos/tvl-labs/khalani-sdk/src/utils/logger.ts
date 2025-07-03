import { createLogger, format, transports, Logger, LoggerOptions } from 'winston';

export let logger: Logger = createLogger({
    level: 'info',
    format: format.simple(),
    defaultMeta: { package: 'khalani-sdk' },
    transports: [new transports.Console()],
});

export function reconfigureLogger(
  options: LoggerOptions
): void {
    logger.configure(options)
}
