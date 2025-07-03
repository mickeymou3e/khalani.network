import { styled } from '@mui/material'
import { Typography } from '@tvl-labs/khalani-ui'

export const MainContainer = styled('div')`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: 82vh;
  gap: 16px;
  background: ${({ theme }) => theme.palette.primary.main};
  padding-right: 50px;

  .text-container {
    margin-left: 13vw;
    margin-bottom: 50px;
    width: 60%;
    justify-content: flex-start;
    @media (max-width: 450px) {
      width: 90%;
      margin-left: 0;
      padding-right: 0;
      .button-container {
        justify-content: center;
      }
    }
  }

  .subtitle {
    text-align: left;
    @media (max-width: 1000px) {
      text-align: center;
    }
  }

  .video-container {
    width: 40%;
    // @media (min-width: 1921px) {
    //   width: 80%;
    // }
    @media (max-width: 450px) {
      width: 100%;
    }
    background: ${({ theme }) => theme.palette.primary.main};
    height: auto;
  }

  @media (min-width: 1921px) {
    height: 78vh;
  }
  @media (max-width: 450px) {
    height: 90vh;
  }

  /* Responsywność dla telefonów */
  @media (max-width: 1000px) {
    padding-right: 0;
    .hero-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .video-container video {
      width: 70%;
    }
  }
`

export const ButtonContainer = styled('div')`
  width: 25%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  bottom: 0;
  @media (min-width: 1920px) and (max-height: 800px) {
    margin-top: 24px;
  }
  @media (min-width: 2200px) and (min-height: 801px) {
    margin-top: 6vh !important;
  }
  @media (min-width: 1920px) and (min-height: 801px) {
    margin-top: 9.5vh;
    width: 30%;
  }
  @media (max-width: 1919px) {
    margin-top: 40px;
    width: fit-content;
    .MuiButton-root {
      padding: 10px 40px;
    }
  }

  @media (max-width: 1100px) {
    width: 40%;
  }
  @media (max-width: 1008px) {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 16px;
    .MuiButton-root {
      margin-top: 50px;
      width: 80%;
    }
  }
  @media (max-width: 450px) {
    width: -webkit-fill-available;
    .MuiButton-root {
      width: 100%;
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
    text-shadow: -6px 0px 0px #615fa8;
    @media (max-width: 450px) {
      text-shadow: -3px 0px 0px #615fa8;
    }
    `,
)
