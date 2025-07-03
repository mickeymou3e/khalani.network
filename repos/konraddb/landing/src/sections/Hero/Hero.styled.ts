import { styled } from '@mui/material'
import background from '@images/section2_background.png'
import { Typography } from '@tvl-labs/khalani-ui'

export const MainContainer = styled('div')`
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`

export const ButtonContainer = styled('div')`
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  bottom: 22%;
  @media (min-width: 1921px) {
    width: 30%;
  }
  @media (max-width: 1100px) {
    width: 40%;
    bottom: 8%;
  }
  @media (max-height: 700px) {
    margin-top: 16px;
  }
  @media (max-width: 899px) {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    bottom: 0;
    margin-top: 16px;
    .MuiButton-root {
      margin-top: 50px;
      width: 80%;
    }
  }
  @media (max-height: 700px) {
    .MuiButton-root {
      margin-top: 0;
    }
  }
`

export const TextContainer = styled('div')`
  flex-grow: 1;
  overflow: auto;
  position: relative;
  z-index: 1;
`

export const H1Text = styled(Typography)(
  () => `
    -webkit-text-stroke: 1px #1e1c3c;
    text-shadow: -4px 5px 3px #90bf9e;
    `,
)
