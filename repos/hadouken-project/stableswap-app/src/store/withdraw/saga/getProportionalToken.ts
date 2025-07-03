import { PROPORTIONAL_TOKEN } from '@containers/pools/WithdrawContainer/WithdrawContainer.constants'
import { renderIconForProportional } from '@containers/pools/WithdrawContainer/WithdrawContainer.utils'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { ITokenWithWeight } from '@store/pool/selectors/models/types'

export const getProportionalToken = (
  tokens: ITokenWithWeight[],
): TokenModelBalanceWithIcon => ({
  ...PROPORTIONAL_TOKEN,
  icon: renderIconForProportional(tokens),
})
