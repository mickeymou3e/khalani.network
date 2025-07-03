import React from 'react'

import Link from '@components/Link'
import { AccountDetails } from '@components/account/AccountDetails'
import Button from '@components/buttons/Button'
import LogoIcon from '@components/icons/logo/Logo'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Menu, Theme, Typography, useMediaQuery } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'

import HamburgerMenu from '../HamburgerMenu'
import { IHeaderLink, IHeaderProps, IPageLink } from './Header.types'

const CONNECT_WALLET_TITLE = 'Connect wallet'

const Header: React.FC<IHeaderProps> = ({
  items,
  authenticated,
  ethAddress,
  nativeTokenBalance,
  nativeTokenSymbol = 'CKB',
  isFetchingNativeTokenBalance,
  chainId,
  RouterLink,
  onAddressClick,
  onWalletButtonClick,
  onHomeClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedTabId, setSelectedTabId] = React.useState<string | null>(null)
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(
    null,
  )
  const [subPages, setSubPages] = React.useState<IPageLink[]>([])
  const open = Boolean(anchorEl)
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    item: IHeaderLink,
  ) => {
    setSubPages(item.pages ?? [])
    setAnchorEl(event.currentTarget)
    setSelectedTabId(item.id)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedTabId(null)
  }

  const handlePageClick = (subPage: IPageLink) => {
    setSelectedPageId(subPage.id)
    handleClose()
  }

  return (
    <AppBar
      sx={{
        justifyContent: 'center',
        borderBottom: (theme) =>
          `1px solid ${theme.palette.background.backgroundBorder}`,
      }}
      position="relative"
    >
      <Toolbar>
        <Box height="100%" width={150} display="flex" alignItems="center">
          <LogoIcon style={{ cursor: 'pointer' }} onClick={onHomeClick} />
        </Box>

        {isDesktop && (
          <Box
            marginX={6}
            height="50%"
            sx={{
              borderRight: (theme) =>
                `1px solid ${theme.palette.background.backgroundBorder}`,
            }}
          />
        )}

        {isDesktop && items && items.length > 0 && (
          <Box width="100%" height="100%" display="flex">
            {items.map((item, index) => {
              const selected = selectedTabId === item.id

              if (item.pages.length === 1) {
                const page = item.pages[0]
                return (
                  <Link
                    sx={{
                      display: 'flex',
                    }}
                    underline="none"
                    linkType={page.linkType}
                    RouterLink={RouterLink}
                    searchParams={page.searchParams}
                    url={page.href}
                    target={undefined}
                  >
                    <Box
                      key={item.id}
                      sx={{
                        transition: '.2s ease-in-out',
                        cursor: 'pointer',
                        color: (theme) =>
                          selected
                            ? theme.palette.text.quaternary
                            : theme.palette.text.primary,
                        '&:hover': {
                          color: (theme) => theme.palette.tertiary.light,
                        },
                      }}
                      display="flex"
                      alignItems="center"
                      pl={{
                        xs: 2,
                        xl: 3,
                      }}
                      pr={4}
                    >
                      <Typography variant="buttonSmall">{page.text}</Typography>
                    </Box>
                  </Link>
                )
              } else if (item.pages.length > 1) {
                return (
                  <Box
                    key={item.id}
                    sx={{
                      transition: '.2s ease-in-out',

                      color: (theme) =>
                        selected
                          ? theme.palette.text.quaternary
                          : theme.palette.text.primary,
                      '&:hover': {
                        color: (theme) => theme.palette.tertiary.light,
                      },
                    }}
                    display="flex"
                    alignItems="center"
                    pl={
                      index === 0
                        ? 0
                        : {
                            xs: 2,
                            xl: 3,
                          }
                    }
                    // replaced with sx
                    pr={4}
                  >
                    <Box
                      sx={{
                        cursor: 'pointer',
                      }}
                      display="flex"
                      alignItems="center"
                      onClick={(event: React.MouseEvent<HTMLElement>) => {
                        handleClick(event, item)
                      }}
                    >
                      <Typography variant="buttonSmall">{item.text}</Typography>
                      {item.pages.length > 1 && (
                        <ArrowDropDownIcon
                          sx={{
                            ml: {
                              xs: 0.5,
                              xl: 1,
                            },

                            transform: selected ? 'rotate(180deg)' : 'inherit',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )
              }
            })}

            <Menu
              sx={{ mb: 4, mt: 2 }}
              anchorEl={anchorEl}
              open={open && subPages.length > 0}
              PaperProps={{
                style: {
                  transform: 'translateX(-16px)',
                },
              }}
              disableAutoFocusItem={true}
              onClose={handleClose}
            >
              {subPages.map((subPage) => {
                const selected = selectedPageId === subPage.id
                return (
                  <Box key={subPage.id} display="flex">
                    <Link
                      onClick={() => handlePageClick(subPage)}
                      sx={{
                        width: '100%',
                        height: '100%',
                        padding: 1,
                        cursor: 'pointer',
                        textDecoration: 'none',

                        color: (theme) =>
                          selected
                            ? theme.palette.tertiary.main
                            : theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                          color: (theme) =>
                            selected
                              ? theme.palette.tertiary.light
                              : theme.palette.tertiary.main,
                        },
                      }}
                      onFocus={(e: React.FocusEvent<HTMLAnchorElement>) =>
                        e.preventDefault()
                      }
                      underline="none"
                      linkType={subPage.linkType}
                      RouterLink={RouterLink}
                      searchParams={subPage.searchParams}
                      url={subPage.href}
                      target={undefined}
                    >
                      <Typography variant="buttonSmall">
                        {subPage.text}
                      </Typography>
                    </Link>
                  </Box>
                )
              })}
            </Menu>
          </Box>
        )}

        <Box
          justifyContent="flex-end"
          alignItems="center"
          marginLeft="auto"
          display="flex"
          minWidth={{ sm: 135, md: 235 }}
        >
          {isTablet && authenticated && (
            <Box pr={{ xs: 1, lg: 0 }}>
              <Box minWidth={220}>
                {ethAddress ? (
                  <AccountDetails
                    chainId={chainId}
                    nativeTokenBalance={nativeTokenBalance ?? '0'}
                    nativeTokenSymbol={nativeTokenSymbol}
                    isFetchingNativeTokenBalance={isFetchingNativeTokenBalance}
                    ethAddress={ethAddress}
                    onAddressClick={onAddressClick}
                  />
                ) : null}
              </Box>
            </Box>
          )}

          {!authenticated && isTablet && (
            <Button
              sx={{ mr: 2 }}
              variant="contained"
              size="tiny"
              color="secondary"
              text={CONNECT_WALLET_TITLE}
              onClick={onWalletButtonClick}
            />
          )}

          {!isDesktop && (
            <HamburgerMenu
              chainId={chainId}
              items={items}
              RouterLink={RouterLink}
              authenticated={authenticated}
              nativeTokenBalance={nativeTokenBalance}
              nativeTokenSymbol={nativeTokenSymbol}
              ethAddress={ethAddress}
              onAddressClick={onAddressClick}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
