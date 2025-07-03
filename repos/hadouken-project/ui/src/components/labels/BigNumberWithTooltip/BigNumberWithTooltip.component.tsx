import React, { useRef } from 'react'

import { Skeleton, Tooltip, Typography } from '@mui/material'
import { Instance } from '@popperjs/core'
import {
  bigNumberToString,
  convertBigNumberToDecimal,
  convertNumberToStringWithCommas,
  getDisplayingValue,
} from '@utils/text'

import { BigNumberWithTooltipProps } from './BigNumberWithTooltip.types'

export const BigNumberWithTooltip: React.FC<BigNumberWithTooltipProps> = ({
  value,
  decimals,
  showDollars,
  dolarTooltip = false,
  tooltipDecimals,
  color,
  isFetching,
  textAlign = 'left',
  variant = 'paragraphMedium',
  roundingDecimals = 3,
}) => {
  const decimalValue = bigNumberToString(value, decimals)
  const positionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const popperRef = useRef<Instance>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY }

    if (popperRef.current != null) {
      popperRef.current.update()
    }
  }

  const displayText = getDisplayingValue(
    Number(decimalValue),
    decimals < roundingDecimals ? decimals : roundingDecimals,
    showDollars,
  )

  return (
    <Tooltip
      title={
        isFetching
          ? ''
          : dolarTooltip
          ? `$${convertNumberToStringWithCommas(
              Number(convertBigNumberToDecimal(value, decimals)),
              tooltipDecimals ?? 2,
            )}`
          : bigNumberToString(value, decimals)
      }
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef?.current?.getBoundingClientRect().y,
              0,
              0,
            )
          },
        },
      }}
    >
      <Typography
        variant={variant}
        ref={areaRef}
        onMouseMove={handleMouseMove}
        color={color}
        textAlign={textAlign}
      >
        {isFetching && <Skeleton width={80} />}
        {!isFetching && displayText}
      </Typography>
    </Tooltip>
  )
}

export default BigNumberWithTooltip
