export interface APIError {
  code: string
  message: string
}

export enum WorkerErrorCodes {
  ERR_INVALID_PARAMS = 'ERR_INVALID_PARAMS',
  PublishRevert = 'PublishRevert',
  ExecTimeout = 'ExecTimeout',
}
