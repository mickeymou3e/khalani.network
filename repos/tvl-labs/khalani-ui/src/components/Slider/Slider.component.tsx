import React from 'react'

import { CustomizedSlider } from './Slider.styled'
import { ISliderProps } from './Slider.types'

const Slider: React.FC<ISliderProps> = (props) => {
  const { value, onChange } = props

  const [percentage, setPercentage] = React.useState<number | undefined>(value)

  const handleSliderChange = (_: Event, newValue: number) => {
    setPercentage(newValue)
    onChange?.(newValue)
  }

  return (
    <CustomizedSlider
      color="primary"
      value={percentage}
      onChange={handleSliderChange}
    />
  )
}

export default Slider
