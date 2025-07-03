import { styled } from '@mui/material'

export const StyledImage = styled('img')`
  width: auto;
  height: calc(3vh + 3vw);
  @media (min-width: 1921px) {
    width: 150px;
    height: 150px;
  }
  @media (max-width: 1500px) {
    width: 60px;
    height: 60px;
  }
  @media (max-width: 1024px) {
    width: 64px;
    height: 64px;
  }
  @media (max-width: 768px) {
    width: 68px;
    height: 68px;
  }
`
