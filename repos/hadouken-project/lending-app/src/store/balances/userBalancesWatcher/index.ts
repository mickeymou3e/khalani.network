import { BigNumber } from 'ethers'
import { all, call, put, select, take } from 'typed-redux-saga'

import { convertBigNumberToDecimal } from '@hadouken-project/ui'
import { ITokenBalance } from '@interfaces/tokens'
import { fetchBackstopPools } from '@store/backstop/fetchBackstopPools/fetchBackstopPools.saga'
import { balancesSelectors } from '@store/balances/balances.selector'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { initializeReservesSagaRpcCall } from '@store/reserves/reserves.initialize.saga'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { reservesActions } from '@store/reserves/reserves.slice'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userDataActions } from '@store/userData/userData.slice'
import { IDepositAsset } from '@store/userData/userData.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState } from '@store/wallet/wallet.types'

import { fetchUserBalances } from '../fetchUserBalances/fetchUserBalances.saga'

export function* awaitStateChange(): Generator {
  yield* take([
    walletActions.changeConnectionStateStatus,
    walletActions.onAccountChange,
    providerActions.depositSuccess,
    providerActions.withdrawSuccess,
    providerActions.borrowSuccess,
    providerActions.repaySuccess,
    providerActions.collateralSuccess,
    providerActions.swapBorrowModeSuccess,
  ])
}

export function* watchBalances(): Generator {
  // Wait for tokens to fetch, before fetchUserBalances call is executed
  yield* all([
    take(providerActions.initializeProviderSuccess),
    take(reservesActions.fetchReservesSuccess),
  ])

  while (true) {
    const { connectionState } = yield* select(
      walletSelectors.connectionStateStatus,
    )
    if (connectionState === ConnectionState.Connected) {
      try {
        yield* call(fetchUserBalances)

        const addressProviderContract = yield* select(
          contractsSelectors.addressProvider,
        )
        const reserveSelector = yield* select(reservesSelectors.selectById)
        const tokenSelector = yield* select(tokenSelectors.selectById)
        const balances = yield* select(
          balancesSelectors.selectAllUserTokensBalance,
        )
        const addressProviderAddress = addressProviderContract?.address
        const uiHelperContract = yield* select(contractsSelectors.uiHelper)
        const userAddress = yield* select(walletSelectors.ethAddress)

        if (uiHelperContract && addressProviderAddress && userAddress) {
          const data = yield* call(
            uiHelperContract.getUserData,
            addressProviderAddress,
            userAddress,
          )
          const [reserveData, userData] = data

          const {
            currentLiquidationThreshold,
            ltv,
            totalCollateralETH,
            totalDebtETH,
          } = userData

          let totalDeposit = BigNumber.from('0')
          const depositAssets: IDepositAsset[] = reserveData.map(
            ([addressUpperCase, isCollateral]) => {
              const address = addressUpperCase.toLocaleLowerCase()
              const reserve = reserveSelector(address)
              const hTokenAddress = reserve?.aTokenAddress
              const hTokenSymbol = tokenSelector(hTokenAddress)?.symbol

              const depositIsCollateral =
                reserve && reserve.ltv.eq(BigNumber.from(0))
                  ? false
                  : isCollateral

              const balance = balances?.find(
                (token) => token?.symbol === hTokenSymbol,
              )?.value

              totalDeposit = totalDeposit.add(balance || BigNumber.from('0'))

              const tokenBalance: ITokenBalance = {
                id: address,
                walletAddress: userAddress,
                tokenAddress: address,
                balance:
                  balance && reserve
                    ? convertBigNumberToDecimal(balance, reserve.decimals)
                    : '0',
              }

              return {
                isCollateral: depositIsCollateral,
                TokenBalance: tokenBalance,
              }
            },
          )

          const userAccData = {
            totalCollateral: totalCollateralETH,
            currentLiquidationThreshold,
            ltv,
            depositAssets,
            totalBorrow: totalDebtETH,
            totalDeposit,
          }

          yield* put(userDataActions.initializeUserDataSuccess(userAccData))

          yield* call(initializeReservesSagaRpcCall)
          // It is separated because it depend on reserves
          yield* call(fetchBackstopPools)
        }
      } catch (e) {
        console.error(e)
      } finally {
      }
    } else {
    }
    // Need to move poolBalances to graphql also consider to set up local rpc node for read-only balances
    // we get blocked request.

    yield* call(awaitStateChange)
  }
}
