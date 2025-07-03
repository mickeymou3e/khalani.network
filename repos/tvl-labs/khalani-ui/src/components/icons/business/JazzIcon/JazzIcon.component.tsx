import React, { useEffect, useRef } from 'react'

import Jazzicon from '@metamask/jazzicon'

import { JazzIconElevation } from './JazzIcon.styled'
import { IJazzIconProps } from './JazzIcon.types'

const JazzIcon: React.FC<IJazzIconProps> = ({
  address,
  size = 16,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (address && ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(
        Jazzicon(size, parseInt(address.slice(2, 10), 16)),
      )
    }
  }, [address, size])

  return <JazzIconElevation {...rest} ref={ref} />
}

export default JazzIcon
