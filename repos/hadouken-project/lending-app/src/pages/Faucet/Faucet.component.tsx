import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { ActionInProgress } from '@constants/Action'
import { getConfig } from '@hadouken-project/lending-contracts'
import { Faucet, FaucetToken } from '@hadouken-project/ui'
import { contractsSelectors } from '@store/provider/provider.selector'
import { providerActions } from '@store/provider/provider.slice'
import { reservesSelectors } from '@store/reserves/reserves.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { ENVIRONMENT } from '@utils/stringOperations'

const FaucetPage: React.FC = () => {
  const dispatch = useDispatch()
  const actionInProgress = useSelector(contractsSelectors.actionInProgress)
  const applicationChainId = useSelector(walletSelectors.applicationChainId)
  const config = getConfig(applicationChainId)?.(ENVIRONMENT)
  const reserves = useSelector(reservesSelectors.selectAll)

  const tokens: FaucetToken[] = reserves
    .filter(
      (token) =>
        token.address.toLowerCase() !==
        config?.nativeToken.wrapAddress?.toLowerCase(),
    )
    .map((token) => {
      return {
        ...token,
        name: token.displayName,
        source: '',
      }
    })

  const onMintRequest = (tokenAddress: string, amount: BigNumber) => {
    dispatch(
      providerActions.mintRequest({
        amount: amount,
        assetAddress: tokenAddress,
      }),
    )
  }

  return (
    <Faucet
      tokens={tokens}
      inProgress={actionInProgress === ActionInProgress.Mint}
      onMintRequest={onMintRequest}
    />
  )
}

export default FaucetPage
