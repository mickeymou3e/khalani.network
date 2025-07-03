import { BigNumber } from 'ethers'

import { isGodwokenNetwork } from '@hadouken-project/lending-contracts'

export const GasLimits = {
  Mint: BigNumber.from(65713),
  Approve: BigNumber.from(44035),
  ApproveStable: BigNumber.from(64035),
  Deposit: BigNumber.from(397319),
  Withdraw: BigNumber.from(497558),
  SwitchCollateral: BigNumber.from(100000),
  Borrow: BigNumber.from(701428),
  Repay: BigNumber.from(452175),
  SwapBorrowMode: BigNumber.from(532237),
  DepositBackstop: BigNumber.from(602237),
  WithdrawBackstop: BigNumber.from(602237),
}

export const GAS_LIMIT_SLIPPAGE = 5
export const GAS_PRICE = (chainId: string) =>
  isGodwokenNetwork(chainId) ? 90000 * 10 ** 9 : undefined

export const WAIT_TRANSACTION_IN_BLOCKS = 1
