import { createLogger, format, transports, Logger } from 'winston';

export let logger: Logger = createLogger();

export function initializeLogger(
  level: 'debug' | 'error' | 'info' = 'info'
): void {
  logger = createLogger({
    level,
    format: format.simple(),
    defaultMeta: { package: 'swap-v2-sdk' },
    transports: [new transports.Console()],
  });
}
