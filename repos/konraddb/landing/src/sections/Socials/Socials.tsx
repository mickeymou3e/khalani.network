import { Box, Link, Typography } from '@mui/material'
import React from 'react'
import config from '@config/'
import discord from '@images/discord.png'
import twitter from '@images/twitter.png'
import github from '@images/github.png'
import linkedin from '@images/linkedin.png'
import { StyledImage } from './Socials.styled'

const Socials = () => {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.primary.main,
      }}
      pt={4}
      pb={2}
    >
      <Typography variant="body2" textAlign={'center'}>
        join our community
      </Typography>
      <Box display="flex" justifyContent="center">
        <Box display="flex">
          <Link
            href={config.socials[0].url}
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <StyledImage src={twitter} alt={twitter} />
          </Link>
          <Link
            href={config.socials[1].url}
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <StyledImage src={discord} alt={discord} />
          </Link>
          <Link
            href={config.socials[2].url}
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <StyledImage src={github} alt={github} />
          </Link>
          <Link
            href={config.socials[3].url}
            target="_blank"
            underline="none"
            color="text.primary"
          >
            <StyledImage src={linkedin} alt={linkedin} />
          </Link>
        </Box>
      </Box>
    </Box>
  )
}

export default Socials
