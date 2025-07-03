import React from 'react'
import { StyledBox, TextContainer } from './ImageWithText.styled'
import TitleInBox from '@components/TitleInBox/TitleInBox'
import { Typography } from '@tvl-labs/khalani-ui'
import { useMediaQuery } from '@mui/material'

interface BoxWithImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
  position: SectionPosition
  title: string
  subtitle: string
  textTopProperty: string
  imageMargin?: string
  displayHeader?: boolean
}

export enum SectionPosition {
  Left = 'left',
  Right = 'right',
}

const ImageWithText: React.FC<BoxWithImageProps> = (props) => {
  const {
    image,
    position,
    title,
    subtitle,
    textTopProperty,
    imageMargin,
    displayHeader = false,
  } = props

  const leftSide = position === SectionPosition.Right
  const rightSide = position === SectionPosition.Left
  const isTablet = useMediaQuery(`(max-width: 899px)`)

  return (
    <StyledBox>
      {displayHeader && (
        <TitleInBox
          text={
            'Never Build Your Own Solvers or Solver Networks from Scratch Again'
          }
        />
      )}

      <img
        src={image}
        style={{
          width: '100%',
          height: 'auto',
          marginTop: isTablet ? 0 : imageMargin,
        }}
      />
      <TextContainer
        left={leftSide ? '4.75vw' : undefined}
        right={rightSide ? '3vw' : undefined}
        top={isTablet ? 0 : textTopProperty}
      >
        <Typography
          variant="h2"
          text={title}
          textAlign={isTablet ? 'center' : 'unset'}
        />
        <Typography
          variant="subtitle2"
          text={subtitle}
          sx={{ mt: 1 }}
          textAlign={isTablet ? 'center' : 'unset'}
        />
      </TextContainer>
    </StyledBox>
  )
}

export default ImageWithText
