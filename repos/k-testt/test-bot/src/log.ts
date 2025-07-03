import { format } from 'util';

export function log(message: string, data?: any) {
  logWithFunction(console.log, 'info', message, data);
}

export function warn(message: string, data?: any) {
  logWithFunction(console.warn, 'warn', message, data);
}

export function error(message: string, data?: any) {
  logWithFunction(console.error, 'error', message, data);
}

function logWithFunction(
  logFn: (...contents: any[]) => void,
  level: string,
  message: string,
  data?: any,
) {
  const fullLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: data ? format(data) : undefined,
  };
  logFn(JSON.stringify(fullLog));
}