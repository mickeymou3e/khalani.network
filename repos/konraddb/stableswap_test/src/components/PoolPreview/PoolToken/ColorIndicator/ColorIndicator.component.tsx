import React from 'react'

export interface ColorIndicatorProps {
  color: string
  width: number
  height: number
}

const ColorIndicator: React.FC<ColorIndicatorProps> = ({
  color,
  width,
  height,
}) => (
  <div
    style={{
      height: `${height}px`,
      width: `${width}px`,
      backgroundColor: color,
      borderRadius: '50%',
    }}
  />
)

export default ColorIndicator
