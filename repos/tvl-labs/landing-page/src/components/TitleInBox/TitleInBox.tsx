import React from 'react'
import { StyledBox } from './TitleInBox.styled'
import { useMediaQuery } from '@mui/material'
import { Typography } from '@tvl-labs/khalani-ui'

interface BoxWithImageProps {
  primaryText: string
  secondaryText: string
}

const TitleInBox: React.FC<BoxWithImageProps> = (props) => {
  const { primaryText, secondaryText } = props
  const isMobile = useMediaQuery(`(max-width: 450px)`)
  const isTablet = useMediaQuery(`(max-width: 950px)`)

  return (
    <StyledBox>
      {isTablet ? (
        <Typography
          variant="h2"
          fontSize={isMobile ? 24 : undefined}
          text={`${primaryText} ${secondaryText}`}
          textAlign={'center'}
        />
      ) : (
        <>
          <Typography
            variant="h2"
            fontSize={isMobile ? 24 : undefined}
            text={primaryText}
            textAlign={'center'}
          />
          <Typography
            variant="h2"
            fontSize={isMobile ? 24 : undefined}
            text={secondaryText}
            textAlign={'center'}
          />
        </>
      )}
    </StyledBox>
  )
}

export default TitleInBox
