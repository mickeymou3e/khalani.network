import { call, put, select } from 'typed-redux-saga'

import { address } from '@dataSource/graph/utils/formatters'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { BigDecimal } from '@utils/math'

import { withdrawSelectors } from '../withdraw.selector'
import { withdrawActions } from '../withdraw.slice'
import { IWithdrawType } from '../withdraw.types'
import { calculateWithdrawPreviewSaga } from './calculateWithdrawPreview.saga'

export function* withdrawPreviewRequestSaga(): Generator {
  const {
    percentage,
    slippage,
    poolId,
    selectedToken,
    withdrawAmount,
    withdrawTokens,
  } = yield* select(withdrawSelectors.withdrawEditor)

  const userAddress = yield* select(walletSelectors.userAddress)

  const selectPoolModel = yield* select(poolsModelsSelector.selectById)

  try {
    if (poolId && userAddress) {
      const poolModel = selectPoolModel(poolId)

      if (poolModel) {
        const selectTokenBalance = yield* select(
          balancesSelectors.selectTokenBalance,
        )

        const isProportional = yield* select(
          withdrawSelectors.isProportionalWithdraw,
        )

        const inToken = poolModel.pool.address

        const userPoolTokenBalance = selectTokenBalance(userAddress, inToken)

        if (userPoolTokenBalance) {
          if (isProportional) {
            const inTokenAmount = userPoolTokenBalance?.mul(
              BigDecimal.from(percentage, 2),
            )

            if (inTokenAmount) {
              const withdrawPreview = yield* call(
                calculateWithdrawPreviewSaga,
                {
                  poolId,
                  inToken,
                  slippage,
                  outTokens: withdrawTokens.map(({ address }) => address),
                  outTokensAmounts: [],
                  type: IWithdrawType.ExactIn,
                  inTokenAmount: inTokenAmount,
                },
              )

              yield* put(
                withdrawActions.withdrawPreviewRequestSuccess(withdrawPreview),
              )
            }
          } else {
            const isMaxAmount = yield* select(withdrawSelectors.isMaxAmount)

            const tokenIndex =
              poolModel && isMaxAmount
                ? poolModel.depositTokens.findIndex(
                    (token) =>
                      address(token.address) ===
                      address(selectedToken?.address ?? ''),
                  )
                : null

            const withdrawPreview = yield* call(calculateWithdrawPreviewSaga, {
              poolId,
              inToken,
              slippage,
              outTokens: withdrawTokens.map(({ address }) => address),
              outTokensAmounts: withdrawTokens.map(({ address }) => {
                if (address === selectedToken?.address) return withdrawAmount

                return BigDecimal.from(0)
              }),
              type: IWithdrawType.ExactOut,
              inTokenAmount: userPoolTokenBalance,
              isMaxAmount,
              tokenIndex,
            })

            yield* put(
              withdrawActions.withdrawPreviewRequestSuccess(withdrawPreview),
            )
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}
