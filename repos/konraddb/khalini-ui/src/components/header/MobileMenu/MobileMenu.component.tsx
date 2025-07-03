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
import { IMobileMenuProps } from './MobileMenu.types'

const CONNECT_WALLET_TITLE = 'Connect wallet'

const MobileMenu: React.FC<IMobileMenuProps> = ({
  items,
  open,
  chainId,
  nativeTokenSymbol,
  nativeTokenBalance,
  ethAddress,
  authenticated,
  onWalletButtonClick,
  handleClose,
  onTabClick,
  onAddressClick,
  RouterLink,
}) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [expanded, setExpanded] = React.useState<string | false>(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  return (
    <Drawer
      BackdropProps={{
        invisible: true,
      }}
      PaperProps={{
        sx: {
          height: '100%',
        },
      }}
      onClose={handleClose}
      anchor="bottom"
      open={open}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        py={{ xs: 1.5, md: 1 }}
        mr={{ xs: -0.5, md: 5.5 }}
      >
        <CloseIcon
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.tertiary.main,
            cursor: 'pointer',
            marginLeft: 'auto',
            width: 24,
            height: 24,
          }}
        />
      </Box>
      {!authenticated && isMobile && (
        <Box width="100%">
          <Button
            variant="contained"
            size="tiny"
            color="secondary"
            fullWidth
            text={CONNECT_WALLET_TITLE}
            onClick={onWalletButtonClick}
          />
          <Divider
            sx={{
              marginY: 4,

              backgroundColor: (theme) =>
                theme.palette.background.backgroundBorder,
            }}
          />
        </Box>
      )}
      {authenticated && isMobile && (
        <>
          <AccountDetails
            chainId={chainId}
            ethAddress={ethAddress ?? ''}
            nativeTokenBalance={nativeTokenBalance ?? ''}
            nativeTokenSymbol={nativeTokenSymbol ?? ''}
            onAddressClick={onAddressClick}
          />

          <Divider
            sx={{
              marginY: 4,

              backgroundColor: (theme) =>
                theme.palette.background.backgroundBorder,
            }}
          />
        </>
      )}
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
                      padding: 0,
                      '.MuiPaper-root': {
                        padding: 0,
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
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
                                    ? theme.palette.text.quaternary
                                    : theme.palette.text.primary,
                              }}
                            />
                          }
                        >
                          <Typography
                            color={(theme) =>
                              expanded === item.id
                                ? theme.palette.text.quaternary
                                : theme.palette.text.primary
                            }
                            variant="buttonBig"
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
                                        ? theme.palette.tertiary.main
                                        : theme.palette.text.primary,
                                    '&:hover': {
                                      color: (theme) =>
                                        theme.palette.tertiary.light,
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
                                      variant="buttonMedium"
                                      paddingRight={2}
                                      borderRight={(theme) =>
                                        selected
                                          ? `2px solid ${theme.palette.tertiary.main}`
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
                            theme.palette.background.backgroundBorder,
                        }}
                      />
                    </Box>
                  </MenuItem>
                )
              } else if (item.pages.length === 1) {
                const page = item.pages[0]
                return (
                  <MenuItem
                    key={item.id}
                    sx={{
                      padding: 0,
                      '.MuiPaper-root': {
                        padding: 0,
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Link
                      onClick={() => onTabClick?.(page)}
                      sx={{
                        display: 'block',

                        textDecoration: 'none',
                        cursor: 'pointer',
                        color: (theme) => theme.palette.text.primary,
                        '&:hover': {
                          color: (theme) => theme.palette.tertiary.light,
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
                      <Box pl={2}>
                        <Typography
                          sx={{
                            flexShrink: 0,
                            color: (theme) => theme.palette.text.primary,
                            '&:hover': {
                              color: (theme) => theme.palette.tertiary.light,
                            },
                          }}
                          variant="buttonBig"
                        >
                          {page.text}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          marginX: 0,
                          marginY: 5.5,

                          backgroundColor: (theme) =>
                            theme.palette.background.backgroundBorder,
                        }}
                      />
                    </Link>
                  </MenuItem>
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
