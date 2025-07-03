import { IRemoveLiquidityRequest } from '@containers/liquidity/LiquidityRemoveContainer/LiquidityRemoveContainer.types'

import api from '../axios.config'

const removeLiquidity = (
  payload: IRemoveLiquidityRequest,
): Promise<IRemoveLiquidityRequest> =>
  api
    .post(`liquidityRemoved`, payload)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const liquidityService = {
  removeLiquidity,
}
