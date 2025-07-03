import React, { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import SettingsIcon from '@mui/icons-material/Settings'

import Button from '../Button/Button.component'
import { IDoubleButtonProps } from './DoubleButton.types'

const DoubleButton: React.FC<IDoubleButtonProps> = (props) => {
  const { primaryLabel, secondaryLabel, onClick } = props
  const [clicked, setClicked] = useState<boolean>(false)

  const handleButtonClick = () => {
    setClicked(!clicked)
    onClick()
  }

  return (
    <Button
      text={clicked ? secondaryLabel : primaryLabel}
      size="small"
      variant="outlined"
      color="primary"
      startIcon={clicked ? <CloseIcon /> : <SettingsIcon />}
      onClick={handleButtonClick}
    ></Button>
  )
}

export default DoubleButton
