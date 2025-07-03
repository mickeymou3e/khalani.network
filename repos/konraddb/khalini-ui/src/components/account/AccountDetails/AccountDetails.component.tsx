import React from 'react'

import numbro from 'numbro'

import Button from '@components/buttons/Button'
import JazzIcon from '@components/icons/business/JazzIcon'
import { IconButton, Skeleton, Tooltip } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatWithMathematicalNotation, getAddressLabel } from '@utils/text'

import { IAccountDetailsProps } from './AccountDetails.types'
import { resolveNetworkIcon, resolveNetworkName } from './AccountDetails.utils'

const AccountDetails: React.FC<IAccountDetailsProps> = ({
  nativeTokenBalance,
  nativeTokenSymbol,
  isFetchingNativeTokenBalance,
  ethAddress,
  chainId,
  onAddressClick,
}) => (
  <Box display="flex" flexDirection="row" alignItems="center">
    <Box display="flex" alignItems="center" paddingRight={{ xs: 1, md: 3 }}>
      <Box mr={1} display="flex">
        <Tooltip
          sx={{ whiteSpace: 'nowrap' }}
          title={resolveNetworkName(chainId)}
          placement="bottom"
        >
          <IconButton>{resolveNetworkIcon(chainId)}</IconButton>
        </Tooltip>
      </Box>

      {!isFetchingNativeTokenBalance && (
        <Tooltip
          sx={{ whiteSpace: 'nowrap' }}
          title={numbro(nativeTokenBalance).format({
            thousandSeparated: true,
            mantissa: 8,
          })}
          placement="bottom"
        >
          <Typography
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.quaternary}
            textAlign="left"
            letterSpacing="0.1em"
          >
            {formatWithMathematicalNotation(Number(nativeTokenBalance))}

            {` ${nativeTokenSymbol}`}
          </Typography>
        </Tooltip>
      )}
      {isFetchingNativeTokenBalance && <Skeleton width={90} />}
    </Box>
    {ethAddress && (
      <Button
        variant="contained"
        size="tiny"
        color="secondary"
        onClick={() => onAddressClick?.(ethAddress)}
        text={getAddressLabel(ethAddress)}
        endIcon={
          <Box p={1}>
            <JazzIcon
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              size={16}
              address={ethAddress}
            />
          </Box>
        }
      />
    )}
  </Box>
)

export default AccountDetails
