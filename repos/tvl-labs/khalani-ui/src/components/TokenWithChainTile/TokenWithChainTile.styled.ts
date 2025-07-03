import { Paper, styled } from '@mui/material'

export const CustomizedTile = styled(Paper)(
  () => `
     width: 100%;
     cursor: pointer;
     :hover {
        background-color: #35364B;
     }
    `,
)
