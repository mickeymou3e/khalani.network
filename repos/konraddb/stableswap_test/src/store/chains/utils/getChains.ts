import { lockService } from '../../../libs/services/lock.service'
import { IChain } from '../chains.types'

export const getChains = (): Promise<void | IChain[]> => {
  return lockService.getChains()
}
