import React, { useEffect } from 'react'

import Slider from '@mui/material/Slider'

import { IPercentageSliderProps } from './PercentageSlider.types'

const PercentageSlider: React.FC<IPercentageSliderProps> = ({
  value,
  onChange,
}) => {
  const [percentage, setPercentage] = React.useState<number | undefined>(value)

  useEffect(() => {
    if (value !== percentage) {
      setPercentage(value)
    }
  }, [value])

  const handleSliderChange = (_: Event, newValue: number) => {
    onChange?.(newValue)
  }
  const handleSliderChangeCommitted = React.useCallback(() => {
    if (percentage) {
      onChange?.(percentage)
    }
  }, [percentage, onChange])

  return (
    <Slider
      color="primary"
      value={percentage}
      onChange={handleSliderChange}
      onChangeCommitted={handleSliderChangeCommitted}
    />
  )
}

export default PercentageSlider
