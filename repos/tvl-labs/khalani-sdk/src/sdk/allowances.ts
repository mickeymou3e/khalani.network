import { Amount } from './amount'
import { allowanceSelectors } from '@store/allowance/allowance.selector'
import { approveRequestSaga } from '@store/approve/approveRequest.saga'
import { updateAllowanceSaga } from '@store/allowance/saga/updateAllowance.saga'
import { runSaga, useReduxSelector } from '@store/store.utils'
import { Token } from './token'

export class Allowances {
  constructor() {}

  async getAllowance(token: Token, owner: string, spenderAddress: string) {
    const allowances = useReduxSelector(allowanceSelectors.allowances)
    const allowance = allowances.find(
      (a) =>
        a.tokenAddress.toLowerCase() === token.address.toLowerCase() &&
        a.spender.toLowerCase() === spenderAddress.toLowerCase() &&
        a.owner.toLowerCase() === owner.toLowerCase(),
    )
    if (!allowance) {
      return undefined
    }
    return Amount.fromBaseUnits(allowance.balance, token.decimals)
  }

  async approveTo(
    token: Token,
    ownerAddress: string,
    spenderAddress: string,
    newAllowance: Amount,
  ) {
    await runSaga(approveRequestSaga, [
      {
        symbol: token.symbol,
        address: token.address,
        amount: newAllowance.baseUnits,
        decimals: token.decimals,
        spender: spenderAddress,
        owner: ownerAddress,
      },
    ])
  }

  async update() {
    await runSaga(updateAllowanceSaga)
  }
}
