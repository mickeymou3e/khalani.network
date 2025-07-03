import React from 'react'

import { EStatus } from '@enums/status.enum'
import { BridgeProcessedMessage } from '@pages/Explorer/sdk/types'

import { ErrorStatusBox, SuccessStatusBox } from './ExplorerModule.styles'

export const resolveStatus = (
  success: boolean,
  transactionStatus: EStatus | null,
  chainMessage?: BridgeProcessedMessage,
) => {
  if (success) {
    return (
      <SuccessStatusBox
        marginLeft={'auto'}
        marginRight={'auto'}
        display={'block'}
        width={'84px'}
        marginTop={'32px'}
      >
        Success
      </SuccessStatusBox>
    )
  } else if (transactionStatus === EStatus.ERROR && !chainMessage) {
    return (
      <ErrorStatusBox
        marginLeft={'auto'}
        marginRight={'auto'}
        display={'block'}
        marginTop={'32px'}
        width={'fit-content'}
      >
        Error: Transaction Failed
      </ErrorStatusBox>
    )
  }
}

export const convertToDecimal = (number: bigint, decimals: number) => {
  const bigNumber = number / BigInt(Math.pow(10, decimals))

  return bigNumber.toString()
}
