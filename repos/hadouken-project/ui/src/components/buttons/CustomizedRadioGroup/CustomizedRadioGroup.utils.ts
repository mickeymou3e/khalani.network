import { BigNumber } from 'ethers'

import { getOptions } from './CustomizedRadioGroup.constants'

export const getInitialId = (decimals: number, value?: BigNumber): string => {
  const options = getOptions(decimals)
  if (!value) {
    return options[1].id
  }

  const option = options.find((x) => x.value.eq(value))

  return option ? option.id : 'custom'
}
