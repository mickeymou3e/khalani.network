import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

const neutralLightest = '#EEE'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: neutralLightest,
    color: 'rgba(0, 0, 0, 0.87)',
    padding: '2px 10px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: neutralLightest,
  },
}))

export default function CustomizedTooltip({
  children,
  title,
}: {
  children: ReactElement<any, any> & ReactNode
  title: string
}) {
  return (
    <LightTooltip title={title} arrow placement="top">
      {children}
    </LightTooltip>
  )
}
