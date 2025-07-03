import { waitForCondition } from '../test.utils'
import { Sdk } from '../../sdk/sdk'
import { UsdToken } from '../../sdk/usdToken/usdToken'
import { Amount } from '../../sdk/amount'
import { Approvable } from '../../sdk/Approvable'
import { LpToken } from '../../sdk/lpToken/LpToken'
import { KlnToken } from 'src/sdk/klnToken/klnToken'

export class Approval {
  constructor(private sdk: Sdk, private approvable: Approvable) {}

  async ensureApproval(
    usdToken: UsdToken | LpToken | KlnToken,
    approvalAmount: Amount,
  ) {
    const allowance = (await this.approvable.getAllowance(usdToken))!
    if (allowance.lt(approvalAmount)) {
      console.log(`Approving token ${usdToken.name} to ${approvalAmount}`)
      await this.approvable.approve(usdToken, approvalAmount)
    }

    await waitForCondition(async () => {
      console.log(`Waiting for approval to commit for ${usdToken.name}`)
      await this.sdk.allowances().update()
      const usdcAllowance = (await this.approvable.getAllowance(usdToken))!
      return approvalAmount.lte(usdcAllowance)
    })
  }
}
