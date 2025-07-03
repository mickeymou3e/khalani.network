import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { useNotification } from '@shared/hooks'
import { StoreDispatch } from '@store/store.types'
import {
  TransactionSummaryModal,
  BridgePreview as BridgePreviewUI,
  formatOutputAmount,
} from '@tvl-labs/khalani-ui'

import { IBridgePreviewProps } from './BridgePreview.types'

const BridgePreview: React.FC<IBridgePreviewProps> = (props) => {
  const { modalOpen, onModalClose, tokens, amounts, payload } = props

  const dispatch = useDispatch<StoreDispatch>()

  const bridgeTokens = useMemo(
    () =>
      tokens.map((token, index) => {
        const amount = amounts?.[index]

        return {
          symbol: token.symbol,
          amount:
            amount !== undefined
              ? formatOutputAmount(amount, token.decimals)
              : undefined,
          chainId: token.chainId,
        }
      }),
    [tokens, amounts],
  )

  const onConfirm = () => {
    if (!payload) return
  }

  const {
    buttonLabel,
    isButtonDisabled,
    steps,
    currentStep,
    navigateToTransactionTX,
  } = useNotification()

  return (
    <TransactionSummaryModal
      title="Review bridge details"
      buttonLabel={buttonLabel}
      secondaryButtonLabel={'View TX In explorer'}
      isButtonDisabled={isButtonDisabled}
      open={modalOpen}
      handleClose={onModalClose}
      steps={steps}
      handleButtonClick={onConfirm}
      handleSecondaryButtonClick={navigateToTransactionTX}
      currentStep={currentStep}
    >
      <BridgePreviewUI tokens={bridgeTokens} />
    </TransactionSummaryModal>
  )
}

export default BridgePreview
