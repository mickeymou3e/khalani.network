import React from 'react'

import TokenWithBackground from '@components/icons/TokenWithBackground'
import { Box, Skeleton, Tooltip, Typography } from '@mui/material'
import { getNetworkIcon } from '@utils/network'
import { formatWithCommas } from '@utils/text'

import { ITokenBalancesListProps } from './TokenBalancesList.types'

const TokenBalancesList: React.FC<ITokenBalancesListProps> = (props) => {
  const { tokenBalancesAcrossChains } = props

  return (
    <Box mt={2}>
      {tokenBalancesAcrossChains.map((item, index) => (
        <Box
          py={2}
          px={1}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          borderBottom={(theme) => `1px solid ${theme.palette.elevation.light}`}
          key={`${item.tokenSymbol}-${index}`}
        >
          <Box display="flex" alignItems="flex-start">
            <TokenWithBackground tokenSymbol={item.tokenSymbol} />
            <Box ml={0.5}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
                lineHeight={1}
              >
                {item.tokenSymbol}
              </Typography>
              <Box display="flex" gap={0.5}>
                {item.balances.map((balance, index) => (
                  <Tooltip
                    title={formatWithCommas(balance.value, item.tokenDecimals)}
                    key={`${balance}-${index}`}
                    arrow
                  >
                    <Box>
                      {getNetworkIcon(balance.chainId, {
                        style: { width: 14, height: 14 },
                      })}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontSize={14}
              textAlign="right"
            >
              {item.summedBalance ? (
                formatWithCommas(item.summedBalance, item.tokenDecimals)
              ) : (
                <Skeleton width={50} />
              )}
            </Typography>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ float: 'right' }}
              textAlign="right"
            >
              {item.summedBalanceUSD ? (
                `$${formatWithCommas(
                  item.summedBalanceUSD,
                  item.tokenDecimals + 8,
                )}`
              ) : (
                <Skeleton width={50} />
              )}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default TokenBalancesList
