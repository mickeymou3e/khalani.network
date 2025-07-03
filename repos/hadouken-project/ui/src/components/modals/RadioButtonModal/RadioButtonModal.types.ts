import { BigNumber } from 'ethers'

import { IModal } from '@interfaces/core'

export interface IRadioButtonModalProps extends IModal {
  description?: string
  customizedAmount?: BigNumber
  maxValue?: BigNumber
  decimals: number
  onCustomizedAmountChange: (value: BigNumber | undefined) => void
  handleClose: () => void
}
