import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { getChainConfig } from '@config'
import { address } from '@dataSource/graph/utils/formatters'
import { Faucet, FaucetToken } from '@hadouken-project/ui'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { tokensActions } from '@store/tokens/tokens.slice'

const FaucetPage: React.FC = () => {
  const dispatch = useDispatch()
  const allTokens = useSelector(tokenSelectors.selectAllTokens)
  const chainId = useSelector(networkSelectors.applicationChainId)
  const config = getChainConfig(chainId)

  const backstopContracts = useSelector(contractsSelectors.backstopContracts)

  const backstop = backstopContracts?.backstop

  const isMintingToken = useSelector(tokenSelectors.isMintingToken)

  const onMintRequest = (address: string, amount: BigNumber) => {
    dispatch(
      tokensActions.mintTokenRequest({
        address: address,
        amount: amount,
      }),
    )
  }

  const faucetTokens: FaucetToken[] = allTokens
    .filter(
      (tok) =>
        !tok.isLpToken &&
        !tok.isLendingToken &&
        !tok.unwrappedAddress &&
        tok.source !== 'ce' &&
        tok.source !== 'multi' &&
        address(config.nativeCurrency.wrapAddress ?? '') !==
          address(tok.address) &&
        address(tok.address) !== address(backstop?.address ?? ''),
    )
    .map((token) => {
      return {
        ...token,
        symbol: token.displayName,
        source: token.source ?? '',
      }
    })

  return (
    <Faucet
      tokens={faucetTokens}
      onMintRequest={onMintRequest}
      inProgress={isMintingToken}
    />
  )
}

export default FaucetPage
