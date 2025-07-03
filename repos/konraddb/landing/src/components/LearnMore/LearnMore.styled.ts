import { Button, styled } from '@mui/material'

export const LearnMoreButton = styled(Button)(
  () => `
    display: inline-block;
    padding: 8px 16px;
    text-decoration: none;
    margin: 0 auto;
    text-transform: capitalize;
    font-size: calc(0.6vh + 0.6vw);
    &:hover {
        background-color: #f2f2f2;
    }
    @media (max-width: 1500px) {
      font-size: 18px;
    }
    @media (max-width: 1024px) {
      font-size: 20px;
    }
    @media (max-width: 768px) {
      font-size: 22px;
    }
  `,
)
