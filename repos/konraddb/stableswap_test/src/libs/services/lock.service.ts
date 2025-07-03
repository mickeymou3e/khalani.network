import { IUserTVLResponse } from '@containers/liquidity/LiquidityListContainer/LiquidityListContainer.types'
import { IChain } from '@store/chains/chains.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { ILockRequest } from '@store/lock/lock.types'
import { BigDecimal } from '@utils/math'

import api from '../axios.config'

const getChains = () =>
  api
    .get<IChain[]>(`chains`)
    .then((res) => res.data)
    .catch((err) => console.log(err))

const getTokens: () => Promise<ITokenModelBalanceWithChain[]> = () =>
  api.get(`tokens`).then((res) => res.data)

const getBalances: () => Promise<
  | {
      address: string
      balance: BigDecimal
    }[]
  | void
> = () =>
  api
    .get(`balances`)
    .then((res) => {
      const mappedBalances = Object.keys(res.data).map((address) => {
        return { address, balance: BigDecimal.from(res.data[address]) }
      })
      return mappedBalances
    })
    .catch((err) => console.log(err))

const deposit = (payload: ILockRequest) =>
  api
    .post(`deposit`, payload)
    .then((res) => res.data)
    .catch((err) => console.log(err))

const getUserTVL = (): Promise<IUserTVLResponse[]> =>
  api
    .get(`userTVL`)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const lockService = {
  getBalances,
  getChains,
  getTokens,
  deposit,
  getUserTVL,
}
