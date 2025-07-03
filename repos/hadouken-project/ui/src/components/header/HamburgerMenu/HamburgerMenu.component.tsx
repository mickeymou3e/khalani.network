import React, { useState } from 'react'

import { CloseIcon } from '@components/icons'
import HamburgerMenuIcon from '@components/icons/business/HamburgerMenu'
import { Box, ClickAwayListener, useTheme } from '@mui/material'
import IconButton from '@mui/material/IconButton'

import MobileMenu from '../MobileMenu'
import { IHamburgerMenuProps } from './HamburgerMenu.types'

const HamburgerMenu: React.FC<IHamburgerMenuProps> = ({
  items,
  chainId,
  RouterLink,
  authenticated,
  nativeTokenSymbol,
  nativeTokenBalance,
  ethAddress,
  onAddressClick,
  onChainClick,
  onWalletButtonClick,
  onLogoutClick,
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const onHamburgerMenuClick = () => {
    if (!open) {
      setOpen(true)
    } else {
      onHandleClose()
    }
  }

  const onHandleClose = () => {
    setOpen(false)
  }

  const onHandleAddressClick = (address: string) => {
    onAddressClick?.(address)
    onHandleClose()
  }

  const onLogout = () => {
    onLogoutClick?.()
  }

  return (
    <ClickAwayListener onClickAway={onHandleClose}>
      <Box>
        <IconButton onClick={onHamburgerMenuClick} edge="end" aria-label="menu">
          {open ? (
            <CloseIcon fill={theme.palette.tertiary.main} />
          ) : (
            <HamburgerMenuIcon fill={theme.palette.tertiary.main} />
          )}
        </IconButton>

        <Box>
          <MobileMenu
            RouterLink={RouterLink}
            items={items}
            open={open}
            chainId={chainId}
            handleClose={() => setOpen(false)}
            onTabClick={() => onHandleClose()}
            authenticated={authenticated}
            nativeTokenBalance={nativeTokenBalance}
            nativeTokenSymbol={nativeTokenSymbol}
            ethAddress={ethAddress}
            onAddressClick={onHandleAddressClick}
            onChainClick={onChainClick}
            onWalletButtonClick={onWalletButtonClick}
            onLogoutClick={onLogout}
          />
        </Box>
      </Box>
    </ClickAwayListener>
  )
}

export default HamburgerMenu
