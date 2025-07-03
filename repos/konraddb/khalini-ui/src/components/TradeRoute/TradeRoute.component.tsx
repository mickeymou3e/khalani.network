import React from 'react'

import { ArrowLeftIcon, ArrowUpIcon } from '@components/icons'
import {
  alpha,
  Box,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { getTokenIconComponent } from '@utils/icons'

import { ITradeRouteProps } from '.'
import { getButtonWidth } from './TradeRoute.utils'

const TradeRoute: React.FC<ITradeRouteProps> = ({
  inToken,
  outToken,
  inTokenValue,
  outTokenValue,
  routes,
  onRouteNodeClick,
}) => {
  const InTokenIcon = getTokenIconComponent(inToken?.symbol)
  const OutTokenIcon = getTokenIconComponent(outToken?.symbol)

  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={1}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="paragraphSmall">{`${inTokenValue} ${inToken?.symbol.toUpperCase()}`}</Typography>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >{`$${inToken.balance}`}</Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="paragraphSmall">{`${outTokenValue} ${outToken?.symbol.toUpperCase()}`}</Typography>
          <Typography
            variant="paragraphTiny"
            color={(theme) => theme.palette.text.gray}
          >{`$${outToken.balance}`}</Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box width="40px" height="40px">
          <InTokenIcon width={40} height={40} />
        </Box>
        <Box
          width="40%"
          borderTop={(theme) =>
            `1px dashed ${alpha(theme.palette.text.gray, 0.1)}`
          }
          mx={2}
          height={'1px'}
        />
        <Typography
          variant="paragraphSmall"
          textAlign="center"
          whiteSpace="nowrap"
          color={(theme) => theme.palette.text.secondary}
        >
          Trade route
        </Typography>
        <Box
          width="40%"
          borderTop={(theme) =>
            `1px dashed ${alpha(theme.palette.text.gray, 0.1)}`
          }
          mx={2}
        />
        <Box width="40px" height="40px">
          <OutTokenIcon width={40} height={40} />
        </Box>
      </Box>
      <Box
        my={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mx={1.5}
      >
        <Box
          display="flex"
          alignItems="end"
          sx={{ transform: 'rotate(180deg)' }}
        >
          <ArrowUpIcon />
        </Box>
        <Box display="flex" alignItems="end">
          <ArrowUpIcon />
        </Box>
      </Box>

      <Box
        mx={2.5}
        height="100%"
        sx={{
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
        }}
        borderLeft={(theme) => `1px solid ${theme.palette.text.secondary}`}
        borderRight={(theme) => `1px solid ${theme.palette.text.secondary}`}
      >
        {routes.map((route, index) => {
          const lastRoute = index === routes.length - 1

          return (
            <Box
              height={{ xs: 36, md: 48 }}
              key={index}
              position="relative"
              borderBottom={(theme) =>
                `1px solid ${theme.palette.text.secondary}`
              }
              sx={{
                borderBottomRightRadius: lastRoute ? 5 : 0,
                borderBottomLeftRadius: lastRoute ? 5 : 0,
              }}
            >
              <Box
                display={{ xs: 'none', md: 'block' }}
                height={48}
                position="absolute"
                top="calc(100% - 36px)"
                left={16}
              >
                <Box display="block">
                  <Typography
                    sx={{ pb: 1 }}
                    component="div"
                    variant="breadCrumbs"
                  >
                    {route.percentage}%
                  </Typography>
                  <ArrowLeftIcon
                    style={{
                      transform: 'rotate(180deg)',
                      width: '100%',
                    }}
                  />
                </Box>
              </Box>

              <Box
                mx={{ xs: 0, md: 2 }}
                width="100%"
                top="50%"
                position="absolute"
              >
                <Box display="flex" justifyContent={'space-around'}>
                  {route.pools.map((routeNode) => {
                    return (
                      <Tooltip
                        key={routeNode.id}
                        title={routeNode.name}
                        placement="top"
                      >
                        <Box
                          onClick={() => onRouteNodeClick?.(routeNode.id)}
                          display="flex"
                          pb={0.25}
                          pl={0.125}
                          width={getButtonWidth(
                            routeNode.tokens.length,
                            isDesktop,
                          )}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: (theme) =>
                              theme.palette.primary.main,
                            border: (theme) =>
                              `1px solid ${theme.palette.text.secondary}`,
                            borderRadius: '89px',

                            '&:hover': {
                              backgroundColor: (theme) =>
                                theme.palette.primary.main,
                            },
                          }}
                        >
                          {routeNode.tokens.map((token) => {
                            const PoolToken =
                              token.icon ?? getTokenIconComponent(token.symbol)

                            return (
                              <Box
                                width={isDesktop ? 16 : 12}
                                height={isDesktop ? 32 : 24}
                                key={token.id}
                              >
                                <Box
                                  p="1px"
                                  borderRadius={99}
                                  height={{ xs: 22, md: 34 }}
                                  width="fit-content"
                                  bgcolor={(theme) =>
                                    theme.palette.primary.main
                                  }
                                >
                                  <PoolToken
                                    width={isDesktop ? 32 : 24}
                                    height={isDesktop ? 32 : 24}
                                  />
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Tooltip>
                    )
                  })}
                </Box>
              </Box>

              <Box
                display={{ xs: 'none', md: 'block' }}
                height={16}
                position="absolute"
                top="calc(100% - 6px)"
                right={16}
                sx={{ transform: 'rotate(180deg)' }}
              >
                <ArrowLeftIcon />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
export default TradeRoute
