import React from 'react'
import { useParams } from 'react-router-dom'

import PoolBalance from '@components/PoolBalance'
import ProportionalSuggestion from '@components/ProportionalSuggestion'
import ConfirmButton from '@components/buttons/ConfirmButton'
import { bigNumberToString, TokenInput } from '@hadouken-project/ui'
import { liquidityService } from '@libs/services/liquidity.service'
import { Paper, Box } from '@mui/material'
import ChainHeader from '@ui/ChainHeader'
import ReceiveBox from '@ui/ReceiveBox'

import { messages } from './LiquidityRemoveContainer.constants'
import { usePoolTokens } from './LiquidityRemoveContainer.hooks'
import { IRemoveLiquidityRequest } from './LiquidityRemoveContainer.types'

const LiquidityRemoveContainer: React.FC = () => {
  const {
    baseTokenValue,
    setBaseTokenValue,
    additionalToken,
    additionalTokenMaxAmount,
    additionalTokenValue,
    setAdditionalTokenValue,
    baseToken,
    baseTokenMaxAmount,
    poolBalancesWithSymbol,
    expectedChain,
    depositTokens,
  } = usePoolTokens()

  const params = useParams<{ id: string }>()

  const remove = (): void => {
    if (!baseToken || !baseTokenValue) {
      return
    }
    const outTokens = [baseToken.address]
    const outTokensAmounts = [baseTokenValue]

    if (additionalToken && additionalTokenValue) {
      outTokens.push(additionalToken.address)
      outTokensAmounts.push(additionalTokenValue)
    }

    const payload: IRemoveLiquidityRequest = {
      poolId: params.id,
      outTokens,
      outTokensAmounts,
    }
    liquidityService.removeLiquidity(payload)
  }

  const baseTokenAmount =
    baseTokenValue && Number(bigNumberToString(baseTokenValue, 18))

  const additionalTokenAmount = additionalTokenValue &&
    additionalToken && {
      tokenSymbol: additionalToken.symbol,
      amount: Number(bigNumberToString(additionalTokenValue, 18)),
    }

  return (
    <Box pt={3}>
      <Paper sx={{ p: 3 }} elevation={3}>
        {expectedChain && <ChainHeader expectedChain={expectedChain} />}
        <TokenInput
          amount={baseTokenValue}
          onAmountChange={(amount) => setBaseTokenValue(amount)}
          onMaxRequest={() => setBaseTokenValue(baseTokenMaxAmount)}
          maxAmount={baseTokenMaxAmount}
          token={baseToken}
        />
        {baseTokenValue && (
          <ProportionalSuggestion
            baseToken={baseToken}
            baseTokenValue={baseTokenValue}
            depositTokens={depositTokens}
            setAdditionalTokenValue={setAdditionalTokenValue}
          />
        )}

        <Box mt={4}>
          <TokenInput
            amount={additionalTokenValue}
            onAmountChange={(amount) => setAdditionalTokenValue(amount)}
            onMaxRequest={() =>
              setAdditionalTokenValue(additionalTokenMaxAmount)
            }
            maxAmount={additionalTokenMaxAmount}
            token={additionalToken}
          />
        </Box>
        <Box mt={4}>
          {poolBalancesWithSymbol && (
            <PoolBalance poolBalancesWithSymbol={poolBalancesWithSymbol} />
          )}
        </Box>
        {baseTokenAmount && baseToken && (
          <ReceiveBox
            amount={baseTokenAmount}
            tokenSymbol={baseToken?.symbol}
            additionalData={additionalTokenAmount}
          />
        )}
        {expectedChain && (
          <ConfirmButton
            onClick={remove}
            text={messages.BUTTON_NAME}
            disabled={!baseTokenValue}
            expectedChainId={expectedChain.chainId}
          />
        )}
      </Paper>
    </Box>
  )
}

export default LiquidityRemoveContainer
