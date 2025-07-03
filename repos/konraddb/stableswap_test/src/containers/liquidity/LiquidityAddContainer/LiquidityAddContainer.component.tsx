import React, { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import PoolBalance from '@components/PoolBalance'
import ProportionalSuggestion from '@components/ProportionalSuggestion'
import { IApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.types'
import { mapToApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.utils'
import ConfirmButton from '@components/buttons/ConfirmButton'
import DepositPreviewContainer from '@containers/DepositPreview'
import { Modal, ModalHeader, TokenInput } from '@hadouken-project/ui'
import { Paper, Box } from '@mui/material'
import { crossChainDepositActions } from '@store/crossChainDeposit/crossChainDeposit.slice'
import ChainHeader from '@ui/ChainHeader'
import { BigDecimal } from '@utils/math'

import { usePoolTokens } from './LiquidityAddContainer.hooks'
import { messages } from './LiquidityAddContainer.messages'

const LiquidityAddContainer: React.FC = () => {
  const dispatch = useDispatch()

  const {
    baseTokenValue,
    setBaseTokenValue,
    additionalToken,
    additionalTokenMaxAmount,
    additionalTokenValue,
    setAdditionalTokenValue,
    baseToken,
    baseTokenMaxAmount,
    expectedChain,
    depositTokens,
    poolBalancesWithSymbol,
    poolId,
  } = usePoolTokens()

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const add = (): void => {
    const chainId = expectedChain?.chainId

    if (
      !baseToken ||
      !baseTokenValue ||
      !poolId ||
      typeof chainId === 'undefined'
    ) {
      return
    }

    const inTokens = [{ address: baseToken.address, chainId }]
    const inTokensAmounts = [BigDecimal.from(baseTokenValue)]

    if (additionalToken && additionalTokenValue) {
      inTokens.push({
        address: additionalToken.address,
        chainId,
      })
      inTokensAmounts.push(BigDecimal.from(additionalTokenValue))
    }

    dispatch(
      crossChainDepositActions.depositPreviewRequest({
        inTokens,
        inTokensAmounts,
        poolId,
        slippage: 0,
      }),
    )

    handleOpen()
  }

  const tokensWithAmount = useMemo(() => {
    const tokens: IApprovalToken[] = []
    if (baseToken && baseTokenValue) {
      tokens.push(mapToApprovalToken(baseToken, baseTokenValue))
    }
    if (additionalToken && additionalTokenValue) {
      tokens.push(mapToApprovalToken(additionalToken, additionalTokenValue))
    }
    return tokens
  }, [additionalToken, additionalTokenValue, baseToken, baseTokenValue])

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
        <Box mt={4} mb={2}>
          {poolBalancesWithSymbol && (
            <PoolBalance poolBalancesWithSymbol={poolBalancesWithSymbol} />
          )}
        </Box>
        {expectedChain && (
          <ConfirmButton
            onClick={add}
            text={messages.BUTTON_NAME}
            disabled={!baseTokenValue}
            expectedChainId={expectedChain.chainId}
            tokensWithAmount={tokensWithAmount}
          />
        )}
      </Paper>
      <Modal open={open} handleClose={handleClose}>
        <ModalHeader title={messages.INVESTMENT_PREVIEW_LABEL} />
        <DepositPreviewContainer onClose={handleClose} crossChain />
      </Modal>
    </Box>
  )
}

export default LiquidityAddContainer
