import { ProviderError } from '@enums/Error.enum'
import { logger } from './logger'

export const handleProviderError = (error: unknown) => {
  const errorJson = JSON.parse(JSON.stringify(error))
  if (errorJson.code === ProviderError.REJECTED) {
    logger.info('User rejected transaction')
  } else {
    logger.error('Transaction has failed: ', error)
  }
  throw error
}
