import { lockService } from '@libs/services/lock.service'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'

export const getTokens = (): Promise<ITokenModelBalanceWithChain[]> => {
  return lockService.getTokens()
}
