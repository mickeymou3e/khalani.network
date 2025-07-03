import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import { ButtonContainer, H1Text, MainContainer } from './Hero.styled'
import { Typography } from '@tvl-labs/khalani-ui'
import Button from '@components/Button/Button'
import config from '@config/'

const Hero = () => {
  const isTablet = useMediaQuery(`(max-width: 899px)`)
  const isBigDesktop = useMediaQuery('(min-width:1921px)')

  return (
    <MainContainer>
      <Box
        padding="0 4.5vw"
        marginTop={isBigDesktop ? '15vh' : '12vh'}
        height="100%"
      >
        <Box pt={7} height={'auto'}>
          <H1Text
            variant="h1"
            text={'Infrastructure for Building'}
            textAlign={isTablet ? 'center' : 'left'}
          />
          <H1Text
            variant="h1"
            text={'Intent-Driven Networks'}
            textAlign={isTablet ? 'center' : 'left'}
          />
          <Typography
            variant="body1"
            text={`Khalani is the infrastructure platform to build intent-driven solver networks that evolve with your users' dynamic needs.`}
            sx={{ width: isTablet ? '100%' : '50%', mt: 4 }}
            textAlign={isTablet ? 'center' : 'left'}
          />
        </Box>
        <ButtonContainer>
          {/* <Button
            text={'Get in Touch'}
            url={
              'https://blog.khalani.network/introducing-khalani-the-decentralized-solver-infrastructure'
            }
          /> */}
          <Button text={'Join Community'} url={config.discordUrl} />
        </ButtonContainer>
      </Box>
    </MainContainer>
  )
}

export default Hero
