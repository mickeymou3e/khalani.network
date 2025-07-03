import logo from '@images/logo.png'
import { StyledBox } from './Header.styled'
import { Link, Stack, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { StyledImage } from '@sections/Socials/Socials.styled'
import twitter from '@images/twitter.png'
import discord from '@images/discord.png'
import telegram from '@images/telegram.png'
import config from '@config/'

const Header = () => {
  const isMobile = useMediaQuery(`(max-width: 450px)`)

  const [marginTop, setMarginTop] = useState(0)

  useEffect(() => {
    const updateMarginTop = () => {
      const elements = document.getElementsByClassName('announcement-bar')
      if (elements.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const barHeight = (elements[0] as any).offsetHeight
        setMarginTop(barHeight)
      }
    }
    updateMarginTop()

    window.addEventListener('resize', updateMarginTop)
    return () => {
      window.removeEventListener('resize', updateMarginTop)
    }
  }, [])

  return (
    <>
      <StyledBox marginTop={`${marginTop}px`}>
        <img
          src={logo}
          alt={logo}
          style={{
            height: '70%',
            width: 'auto',
            objectFit: 'contain',
            marginLeft: isMobile ? -8 : 0,
          }}
        />
        <Stack direction="row" pr={2}>
          <Link
            href={config.socials[0].url}
            target="_blank"
            underline="none"
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <StyledImage
              src={twitter}
              alt={'twitter'}
              sx={{ height: '50px !important' }}
            />
          </Link>
          <Link
            href={config.socials[1].url}
            target="_blank"
            underline="none"
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <StyledImage
              src={discord}
              alt={'discord'}
              sx={{ height: '50px !important' }}
            />
          </Link>
          <Link
            href={config.socials[4].url}
            target="_blank"
            underline="none"
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'flex-end' }}
          >
            <StyledImage
              src={telegram}
              alt={'telegram'}
              sx={{ height: '50px !important' }}
            />
          </Link>
        </Stack>
      </StyledBox>
    </>
  )
}

export default Header
