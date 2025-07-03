import { Button, styled } from '@mui/material'

export const PrimaryButton = styled(Button)(
  () => `
    width: 100%;
    background-color: #1e1c3c; /* A1 color */
    color: white; /* White text */
    border: 3px solid white; /* White border with 3px thickness */
    border-radius: 25px; /* 25px corner radius */
    padding: 10px 0; /* Padding around the text */
    text-decoration: none; /* Removes underline from links */
    font-size: 16px; /* Text size */
    display: inline-block; /* Allows setting padding and dimensions */
    cursor: pointer; /* Changes cursor to pointer on hover */
    transition: background-color 0.3s ease;
  `,
)
