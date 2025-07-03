import { Box, Typography, styled } from '@mui/material'

export const LogoIcon = styled('img')`
  width: auto;
  height: 340px;
  @media (max-width: 2500px) {
    height: 310px;
  }
  @media (max-width: 2100px) {
    height: 250px;
  }
  @media (max-width: 1915px) {
    height: 240px;
  }
  @media (max-width: 1555px) {
    height: 210px;
  }
  @media (max-width: 1350px) {
    height: 170px;
  }
  @media (max-width: 1008px) {
    height: 130px;
  }
  @media (max-width: 600px) {
    height: 100px;
  }
`

export const SocialBackground = styled(Box)`
  background-color: #1e1c3c;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: auto;
  @media (max-width: 990px) {
    height: auto;
  }
  @media (max-width: 550px) {
    height: auto;
    flex-direction: column;
    padding: 24px 0;
  }
`

export const StyledImage = styled('img')`
  width: auto;
  height: 117px;
  @media (max-width: 2500px) {
    height: 101px;
  }
  @media (max-width: 2100px) {
    height: 96px;
  }
  @media (max-width: 1920px) {
    height: 93px;
  }
  @media (max-width: 1915px) {
    height: 76.5px;
  }
  @media (max-width: 1555px) {
    height: 65px;
  }
  @media (max-width: 1350px) {
    height: 46.5px;
  }
  @media (max-width: 450px) {
    height: 43.5px;
  }
`

export const IconsContainer = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: end;
  padding-right: 10vw;
  @media (max-width: 2500px) {
    padding-right: 8vw;
  }
  @media (max-width: 1915px) {
    padding-right: 6vw;
  }
  @media (max-width: 1555px) {
    padding-right: 6vw;
  }
  @media (max-width: 1350px) {
    padding-right: 5vw;
  }
  @media (max-width: 600px) {
    padding-right: 12px;
    justify-content: center;
  }
`

export const ResponsiveH3 = styled(Typography)`
  font-family: 'Agency FB';
  letter-spacing: 1.5px;

  font-size: 105px;

  @media (max-width: 2500px) {
    font-size: 90px;
  }

  @media (max-width: 2100px) {
    font-size: 85px;
  }

  @media (max-width: 1920px) {
    font-size: 83px;
  }
  @media (max-width: 1915px) {
    font-size: 67px;
  }
  @media (max-width: 1555px) {
    font-size: 56px;
  }
  @media (max-width: 1350px) {
    font-size: 39px;
  }

  @media (max-width: 1008px) {
    font-size: 39px;
  }

  @media (max-width: 450px) {
    font-size: 36px;
  }
`
