import { Box, styled } from '@mui/material'

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '18vh',
  transition: 'top 0.5s',
  width: '100%',
  zIndex: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '@media (min-width:1921px)': {
    height: '22vh',
  },
  '@media (max-width:450px)': {
    height: '10vh',
    paddingLeft: 0,
  },
}))
