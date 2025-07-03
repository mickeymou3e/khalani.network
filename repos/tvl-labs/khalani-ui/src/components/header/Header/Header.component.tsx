import React, { useEffect } from 'react'

import Link from '@components/Link'
import { AccountDetails } from '@components/account/AccountDetails'
import NetworkDetails from '@components/account/NetworkDetails'
import PrimaryButton from '@components/buttons/PrimaryButton'
import { LogoIcon, WalletIcon } from '@components/icons'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Menu, Theme, Typography, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'

import HamburgerMenu from '../HamburgerMenu'
import { CustomizedAppBar } from './Header.styled'
import { IHeaderLink, IHeaderProps, IPageLink } from './Header.types'
import HeaderItem from './components/HeaderItem'

const Header: React.FC<IHeaderProps> = ({
  items,
  authenticated,
  ethAddress,
  RouterLink,
  showConnectWalletButton,
  currentTabId,
  selectedChainId,
  chains,
  isUnsupportedNetwork = false,
  headerLogo = <LogoIcon />,
  onChainSelect,
  onAddressClick,
  onWalletButtonClick,
  onHomeClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedTabId, setSelectedTabId] = React.useState<string | undefined>()
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
  }

  const handlePageClick = (subPage: IPageLink) => {
    setSelectedPageId(subPage.id)
    handleClose()
  }

  useEffect(() => {
    setSelectedTabId(currentTabId)
  }, [currentTabId])

  return (
    <CustomizedAppBar position="relative">
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        onClick={onHomeClick}
        sx={{ cursor: 'pointer' }}
      >
        {headerLogo}
      </Box>

      {isDesktop && items && items.length > 0 && (
        <Box display="flex" ml="7vw" gap={2}>
          {items.map((item, index) => {
            const selected = selectedTabId === item.id

            if (item.pages.length === 1) {
              return (
                <HeaderItem
                  key={item.id}
                  page={item.pages[0]}
                  routerLink={RouterLink}
                  selected={selected}
                  onClick={() => setSelectedTabId(item.id)}
                />
              )
            } else if (item.pages.length > 1) {
              return (
                <Box
                  key={item.id}
                  sx={{
                    transition: '.2s ease-in-out',

                    color: (theme) =>
                      selected
                        ? theme.palette.text.secondary
                        : theme.palette.text.primary,
                    '&:hover': {
                      color: (theme) => theme.palette.secondary.light,
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
                    <Typography variant="button">{item.text}</Typography>
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
                          ? theme.palette.secondary.main
                          : theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.background.default,
                        color: (theme) =>
                          selected
                            ? theme.palette.secondary.light
                            : theme.palette.secondary.main,
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
                    <Typography variant="button">{subPage.text}</Typography>
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
        display="flex"
        minWidth={{ sm: 135, md: 235 }}
      >
        {showConnectWalletButton &&
          isTablet &&
          (authenticated || isUnsupportedNetwork) && (
            <Box pr={{ xs: 1, lg: 0 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={1}
              >
                <NetworkDetails
                  selectedChainId={selectedChainId}
                  chains={chains}
                  onChainSelect={onChainSelect}
                />
                {ethAddress ? (
                  <AccountDetails
                    ethAddress={ethAddress}
                    onAddressClick={onAddressClick}
                  />
                ) : null}
              </Box>
            </Box>
          )}

        {showConnectWalletButton &&
          !authenticated &&
          isTablet &&
          !isUnsupportedNetwork && (
            <PrimaryButton
              variant="contained"
              size="large"
              color="primary"
              onClick={onWalletButtonClick}
              startIcon={<WalletIcon />}
            >
              Connect wallet
            </PrimaryButton>
          )}

        {!isDesktop && (
          <HamburgerMenu
            items={items}
            RouterLink={RouterLink}
            authenticated={authenticated}
            ethAddress={ethAddress}
            onAddressClick={onAddressClick}
            onWalletButtonClick={onWalletButtonClick}
            showConnectWalletButton={showConnectWalletButton}
          />
        )}
      </Box>
    </CustomizedAppBar>
  )
}

export default Header
