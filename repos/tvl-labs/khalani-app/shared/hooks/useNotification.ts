import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import config from '@config'
import { notificationSelectors } from '@store/notification/notification.selector'
import {
  checkIfButtonIsDisabled,
  resolveButtonLabel,
} from '@store/notification/notification.utils'
import { Step } from '@tvl-labs/khalani-ui'
import { IApprovalToken } from '@tvl-labs/sdk/dist/app/src/store/approve/approve.types'

import { historySelector } from '../store'

interface UseNotification {
  buttonLabel: string
  isButtonDisabled: boolean
  steps: Step[]
  currentStep: number
  tokensToApprove: IApprovalToken[]
  navigateToTransactionTX: () => void
}

export const useNotification = (): UseNotification => {
  const txStore = useSelector(historySelector.lastTx)

  const steps = useSelector(notificationSelectors.steps)
  const currentStep = useSelector(notificationSelectors.currentStep)
  const tokensToApprove = useSelector(notificationSelectors.tokensToApprove)

  const buttonLabel = resolveButtonLabel(steps, currentStep, tokensToApprove)
  const isButtonDisabled = checkIfButtonIsDisabled(steps, currentStep)

  const [tx, setTx] = useState<string>()
  useEffect(() => {
    if (txStore) {
      setTx(txStore)
    }
  }, [txStore])

  const navigateToTransactionTX = () => {
    window.open(`${config.explorerUrl}/explorer/${tx}`, '_blank')
  }

  return {
    buttonLabel,
    isButtonDisabled,
    steps,
    currentStep,
    tokensToApprove,
    navigateToTransactionTX,
  }
}
