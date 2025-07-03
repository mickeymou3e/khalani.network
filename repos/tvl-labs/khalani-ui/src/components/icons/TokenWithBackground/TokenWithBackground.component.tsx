import React from 'react'

import { getTokenComponent } from '@utils/icons'

import { IconBackground } from '../icons.styled'
import { ITokenWithBackground } from './TokenWithBackground.types'

const TokenWithBackground: React.FC<ITokenWithBackground> = (props) => {
  const { tokenSymbol, tokenIconSize } = props

  return (
    <IconBackground position="relative">
      {getTokenComponent(tokenSymbol, tokenIconSize)}
    </IconBackground>
  )
}

export default TokenWithBackground
