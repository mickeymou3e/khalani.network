import { Button, styled } from '@mui/material'

export const PrimaryButton = styled(Button)(
  () => `
    font-family: 'Courier';
    display: flex;
    width: auto;
    background-color: #1e1c3c;
    color: white;
    border: 3px solid white;
    border-radius: 25px;
    padding: 8px 24px;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    :hover {
      background-color: unset;
    }

    @media(max-width: 450px) {
      border-radius: 14px; 
    }
  `,
)
