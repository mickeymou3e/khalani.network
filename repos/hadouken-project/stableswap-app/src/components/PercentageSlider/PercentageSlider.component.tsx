import React, { useEffect } from 'react'

import Slider from '@mui/material/Slider'

import { IPercentageSliderProps } from './PercentageSlider.types'

const PercentageSlider: React.FC<IPercentageSliderProps> = ({
  value,
  onChange,
  onChangeCommitted,
}) => {
  const [percentage, setPercentage] = React.useState<number | undefined>(value)

  useEffect(() => {
    if (value !== percentage) {
      setPercentage(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleSliderChange = (_: Event, newValue: number) => {
    onChange?.(newValue)
  }
  const handleSliderChangeCommitted = React.useCallback(() => {
    if (percentage || percentage === 0) {
      onChange?.(percentage)
      onChangeCommitted?.(percentage)
    }
  }, [percentage, onChange, onChangeCommitted])

  return (
    <Slider
      color="primary"
      value={percentage}
      onChange={handleSliderChange}
      onChangeCommitted={handleSliderChangeCommitted}
      sx={{
        backgroundColor: 'transparent',
        border: 'none',
      }}
    />
  )
}

export default PercentageSlider
