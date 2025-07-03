import { ContractTransaction } from 'ethers'
import { call, select } from 'typed-redux-saga'

import { CONFIRMATIONS } from '@constants/Networks'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

export function* phaseTwoDeposit(
  hdkAmount: BigDecimal,
  ethAmount: BigDecimal,
  isNativeToken: boolean,
): Generator {
  const lockdropContract = yield* select(contractsSelectors.lockDropConnector)
  const userAddress = yield* select(walletSelectors.userAddress)

  if (!lockdropContract) throw new Error('Lockdrop not defined')
  if (!userAddress) throw new Error('User not defined')

  let depositTransaction: ContractTransaction | null

  if (isNativeToken) {
    depositTransaction = yield* call(
      lockdropContract.depositPhaseTwo,
      hdkAmount.toBigNumber(),
      0,
      {
        value: ethAmount.toBigNumber(),
      },
    )
  } else {
    depositTransaction = yield* call(
      lockdropContract.depositPhaseTwo,
      hdkAmount.toBigNumber(),
      ethAmount.toBigNumber(),
    )
  }

  if (depositTransaction) {
    const transactionResult = yield* call(
      depositTransaction.wait,
      CONFIRMATIONS,
    )
    return transactionResult
  }
}
