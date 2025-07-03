import HeaderLink from '@components/HeaderLink'
import { Link, LinkEnum, LogoIcon } from '@hadouken-project/ui'
import { messages } from '@messages/landing'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import React from 'react'

import MobileLink from '@components/MobileLink/MobileLink.component'

const items = [
  {
    id: 1,
    href: 'https://discord.com/invite/pxZJpJPJBH',
    text: 'COMMUNITY',
  },
  {
    id: 3,
    href: 'https://hadouken.gitbook.io/hadouken/',
    text: 'DOCS',
  },
  {
    id: 2,
    href: 'https://twitter.com/HadoukenFinance',
    text: 'TWITTER',
  },
]

const Header: React.FC = () => {
  const { palette } = useTheme()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (!open) {
      setAnchorEl(event.currentTarget)
    } else {
      setAnchorEl(null)
    }
  }

  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: 1000 + 2,
        px: {
          xs: 2,
          lg: 6,
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        height="100%"
        justifyContent="space-between"
      >
        <Box display="flex" height="100%" alignItems="center" mx={1}>
          <LogoIcon />
        </Box>
        {isDesktop ? (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              height="100%"
              width="100%"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
                marginX="auto"
              >
                {items &&
                  items.map((item) => {
                    return (
                      <Box key={item.id} marginX={6} width="100%">
                        <HeaderLink
                          text={item.text}
                          href={item.href}
                        ></HeaderLink>
                      </Box>
                    )
                  })}
              </Box>
            </Box>
            <Box mx={1}>
              <Link
                linkType={LinkEnum.External}
                url={process.env.NEXT_PUBLIC_APPLICATION_URL}
              >
                <Button
                  sx={{ width: 240 }}
                  variant="contained"
                  size="large"
                  color="secondary"
                >
                  {messages.LAUNCH_APP}
                </Button>
              </Link>
            </Box>
          </>
        ) : (
          <Box width="100%" justifyContent="end" display="flex">
            <IconButton onClick={handleMenu} aria-label="menu">
              {open ? (
                <CloseIcon
                  style={{
                    color: palette.tertiary.main,
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <MenuIcon style={{ color: palette.tertiary.main }} />
              )}
            </IconButton>
          </Box>
        )}
      </Box>
      <Drawer
        style={{
          zIndex: 1000 + 1,
        }}
        BackdropProps={{
          invisible: true,
        }}
        PaperProps={{
          sx: {
            height: {
              xs: 'calc(100% - 78px)',
              md: 'calc(100% - 87px)',
              lg: 'calc(100% - 96px)',
            },
          },
        }}
        onClose={() => {
          setAnchorEl(null)
        }}
        anchor="bottom"
        open={open}
      >
        <Box pb={4} display="flex" alignItems="center" justifyContent="center">
          <Link
            linkType={LinkEnum.External}
            url={process.env.NEXT_PUBLIC_APPLICATION_URL}
          >
            <Button
              sx={{ width: 240 }}
              variant="contained"
              size="large"
              color="secondary"
            >
              {messages.LAUNCH_APP}
            </Button>
          </Link>
        </Box>
        <Box>
          {items.map((item) => {
            return (
              <Box key={item.id}>
                <MobileLink text={item.text} href={item.href} />
              </Box>
            )
          })}
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default Header
