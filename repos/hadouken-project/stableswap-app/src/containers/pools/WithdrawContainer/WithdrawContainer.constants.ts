import { BigNumber } from 'ethers'
import { v4 as uuid } from 'uuid'

export const PROPORTIONAL_TOKEN = {
  balance: BigNumber.from(0),
  address: uuid(),
  decimals: 18,
  name: 'All tokens',
  symbol: 'ALL',
  id: uuid(),
  hideBalance: true,
  displayName: 'All tokens',
  source: '',
}
