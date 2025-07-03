import React from 'react'
import { StyledBox, TextContainer } from './ImageWithText.styled'
import { Typography } from '@tvl-labs/khalani-ui'
import { useMediaQuery } from '@mui/material'
import Button from '@components/Button/Button'

interface BoxWithImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image: any
  position: SectionPosition
  title: string
  subtitle: string
  textTopProperty: string
  buttonUrl: string
  buttonText: string
  imageMargin?: string
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
    buttonUrl,
    buttonText,
  } = props

  const leftSide = position === SectionPosition.Right
  const rightSide = position === SectionPosition.Left
  const isTablet = useMediaQuery(`(max-width: 1008px)`)

  return (
    <StyledBox>
      {/* {displayHeader && (
        <TitleInBox
          primaryText={'Never Build Your Own Solvers'}
          secondaryText={'from Scratch Again'}
        />
      )} */}

      <img
        src={image}
        style={{
          width: '100%',
          height: 'auto',
          marginTop: imageMargin,
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
          textAlign={isTablet ? 'justify' : 'left'}
        />
        <Button text={buttonText} url={buttonUrl} sx={{ zIndex: 2, mt: 2 }} />
      </TextContainer>
    </StyledBox>
  )
}

export default ImageWithText
