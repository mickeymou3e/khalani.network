import React from 'react'

import { SwitchProps } from '@mui/material'

import CustomizedSwitch from './Switch.styled'

const Switch: React.FC<SwitchProps> = (props) => {
  return <CustomizedSwitch {...props} />
}

export default Switch
