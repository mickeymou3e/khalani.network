import { IModal } from '@interfaces/core'

export interface IRadioButtonModalProps extends IModal {
  description?: string
  customizedAmount?: bigint
  maxValue?: bigint
  decimals: number
  onCustomizedAmountChange: (value: bigint | undefined) => void
  handleClose: () => void
}
