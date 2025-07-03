import LogoIcon from '@images/Logo'
import { Box, Container, Typography } from '@mui/material'
import React from 'react'

const Main = () => (
  <Container
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: { xs: 'center', md: 'flex-start' },
      minHeight: '100vh',
      gap: 7,
    }}
  >
    <LogoIcon />

    <Typography
      variant="h1"
      sx={{
        fontSize: { xs: 36, md: 48 },
        fontFamily: 'Bai Jamjuree',
        textAlign: { xs: 'center', md: 'left' },
      }}
      lineHeight="113%"
    >
      Defying boundaries, empowering <br /> Innovation
    </Typography>

    <Box>
      <Typography
        variant="body1"
        color="text.secondary"
        lineHeight="113%"
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      >
        Tunnel Vision Labs is dedicated to revolutionizing the financial sector
        through its expertise in DeFi,
        <br /> infrastructure development, and interoperability.
      </Typography>
    </Box>
  </Container>
)

export default Main
