import React, { useState } from 'react'

import HamburgerMenuIcon from '@components/icons/business/HamburgerMenu'
import CloseIcon from '@mui/icons-material/Close'
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

  return (
    <ClickAwayListener onClickAway={onHandleClose}>
      <Box>
        <IconButton onClick={onHamburgerMenuClick} edge="end" aria-label="menu">
          {open ? (
            <CloseIcon sx={{ color: (theme) => theme.palette.tertiary.main }} />
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
          />
        </Box>
      </Box>
    </ClickAwayListener>
  )
}

export default HamburgerMenu
