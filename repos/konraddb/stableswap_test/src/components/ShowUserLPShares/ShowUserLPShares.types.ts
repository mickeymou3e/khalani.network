import React from 'react'

import { ButtonProps } from '@mui/material'

export type IShowUserLPSharesProps = {
  poolName: string
  children: (props: ButtonProps) => React.ReactNode
}
