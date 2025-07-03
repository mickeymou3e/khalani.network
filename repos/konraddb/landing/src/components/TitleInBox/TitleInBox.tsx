import React from 'react'
import { StyledBox } from './TitleInBox.styled'
import { Typography } from '@tvl-labs/khalani-ui'
import { useMediaQuery } from '@mui/material'

interface BoxWithImageProps {
  text: string
}

const TitleInBox: React.FC<BoxWithImageProps> = (props) => {
  const { text } = props
  const isMobile = useMediaQuery(`(max-width: 400px)`)

  return (
    <StyledBox>
      <Typography
        variant="h2"
        fontSize={isMobile ? 32 : undefined}
        text={text}
        textAlign={'center'}
      />
    </StyledBox>
  )
}

export default TitleInBox
