import React from 'react'

import Link from '@components/Link'
import AccountDetails from '@components/account/AccountDetails'
import Button from '@components/buttons/Button'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  Drawer,
  MenuItem,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Box from '@mui/material/Box'

import { IPageLink } from '../Header'
import { MobileMenuItem } from './MobileMenu.styled'
import { IMobileMenuProps } from './MobileMenu.types'

const CONNECT_WALLET_TITLE = 'Connect wallet'

const MobileMenu: React.FC<IMobileMenuProps> = ({
  items,
  open,
  ethAddress,
  authenticated,
  onWalletButtonClick,
  handleClose,
  onTabClick,
  onAddressClick,
  RouterLink,
  showConnectWalletButton,
}) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  return (
    <Drawer
      PaperProps={{
        elevation: 2,
        sx: {
          height: '100%',
        },
      }}
      onClose={handleClose}
      anchor="bottom"
      open={open}
    >
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="flex-end"
          py={{ xs: 1.5, md: 1 }}
          mr={{ xs: -0.5, md: 5.5 }}
        >
          <CloseIcon
            onClick={handleClose}
            sx={{
              color: (theme) => theme.palette.secondary.main,
              cursor: 'pointer',
              marginLeft: 'auto',
              width: 24,
              height: 24,
            }}
          />
        </Box>
        {!authenticated && isMobile && showConnectWalletButton && (
          <Box width="100%">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              text={CONNECT_WALLET_TITLE}
              onClick={onWalletButtonClick}
            />
          </Box>
        )}
        {authenticated && isMobile && (
          <AccountDetails
            ethAddress={ethAddress ?? ''}
            onAddressClick={onAddressClick}
          />
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent={authenticated ? 'flex-start' : 'space-between'}
        alignItems="center"
      >
        {items && (
          <Box width="100%" paddingX={{ xs: 0, md: 6 }}>
            {items.map((item) => {
              if (item.pages.length > 1) {
                return (
                  <MenuItem
                    key={item.id}
                    sx={{
                      backgroundColor: (theme) => theme.palette.elevation.main,
                      padding: 0,
                      '.MuiPaper-root': {
                        padding: 0,
                      },
                    }}
                  >
                    <Box
                      width="100%"
                      sx={{
                        cursor: 'default',
                      }}
                    >
                      <Accordion
                        sx={{
                          '.MuiCollapse-root': {
                            cursor: 'default',
                          },
                        }}
                        expanded={expanded === item.id}
                        onChange={(_e, isExpanded: boolean) =>
                          setExpanded(isExpanded ? item.id : false)
                        }
                      >
                        <AccordionSummary
                          sx={{
                            justifyContent: 'start',
                            '.MuiAccordionSummary-root': {
                              cursor: 'initial',
                              paddingLeft: 0,
                            },
                            '.MuiAccordionSummary-content': {
                              flexGrow: 0,
                            },
                            '.MuiAccordionSummary-expandIconWrapper': {
                              ml: 2,
                            },
                          }}
                          expandIcon={
                            <ArrowDropDownIcon
                              sx={{
                                width: 32,
                                height: 32,
                                fill: (theme) =>
                                  expanded === item.id
                                    ? theme.palette.text.secondary
                                    : theme.palette.text.primary,
                              }}
                            />
                          }
                        >
                          <Typography
                            color={(theme) =>
                              expanded === item.id
                                ? theme.palette.text.secondary
                                : theme.palette.text.primary
                            }
                            variant="button"
                            sx={{ flexShrink: 0 }}
                          >
                            {item.text}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            padding: 0,
                            paddingLeft: 2,
                          }}
                        >
                          <Box>
                            {item.pages.map((page) => {
                              const handleClick = (page: IPageLink) => {
                                setSelectedId(page.id)
                                onTabClick?.(page)
                              }
                              const selected = selectedId === page.id

                              return (
                                <Link
                                  onClick={() => handleClick(page)}
                                  sx={{
                                    display: 'block',
                                    py: 3,
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    color: (theme) =>
                                      selected
                                        ? theme.palette.secondary.main
                                        : theme.palette.text.primary,
                                    '&:hover': {
                                      color: (theme) =>
                                        theme.palette.secondary.light,
                                    },
                                  }}
                                  width="100%"
                                  key={page.id}
                                  linkType={page.linkType}
                                  RouterLink={RouterLink}
                                  url={page.href}
                                  searchParams={page.searchParams}
                                  underline="none"
                                  target={undefined}
                                >
                                  <Box display="flex">
                                    <Typography
                                      variant="button"
                                      paddingRight={2}
                                      borderRight={(theme) =>
                                        selected
                                          ? `2px solid ${theme.palette.secondary.main}`
                                          : 'none'
                                      }
                                    >
                                      {page.text}
                                    </Typography>
                                  </Box>
                                </Link>
                              )
                            })}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                      <Divider
                        sx={{
                          marginX: 0,
                          marginY: 4,

                          backgroundColor: (theme) =>
                            theme.palette.background.default,
                        }}
                      />
                    </Box>
                  </MenuItem>
                )
              } else if (item.pages.length === 1) {
                const page = item.pages[0]
                return (
                  <MobileMenuItem key={item.id}>
                    <Link
                      onClick={() => onTabClick?.(page)}
                      width="100%"
                      key={page.id}
                      linkType={page.linkType}
                      RouterLink={RouterLink}
                      url={page.href}
                      searchParams={page.searchParams}
                      underline="none"
                      target={undefined}
                    >
                      <Box pl={2}>
                        <Typography
                          variant="button"
                          color="primary"
                          sx={{ color: (theme) => theme.palette.text.primary }}
                        >
                          {page.text}
                        </Typography>
                      </Box>
                    </Link>
                  </MobileMenuItem>
                )
              }
            })}
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export default MobileMenu
