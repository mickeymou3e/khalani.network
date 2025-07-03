import React, { useCallback } from 'react'

import { BigNumber } from 'ethers'

import MaxAmountSelector from '@components/MaxAmountSelector'
import { ErrorIcon } from '@components/icons'
import BigNumberInput from '@components/inputs/BigNumberInput'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { getTokenIconWithChainComponent } from '@utils/icons'

import { ITokenInputProps } from './TokenInput.types'

const TokenInput: React.FC<ITokenInputProps> = ({
  token,
  disabled,
  amount,
  maxAmount,
  isFetchingMaxAmount,
  error,
  onAmountChange,
  onMaxRequest,
  hideStartAdornment,
  maxInputDisabled,
  tokenIconStyle = { height: 32, width: 32 },
  isFetching = false,
}) => {
  const theme = useTheme()
  const onMaxClick = useCallback(() => {
    if (token) {
      onMaxRequest?.(token.address)
    }
  }, [onMaxRequest, token])

  const IconComponent = getTokenIconWithChainComponent(
    token?.symbol ?? '',
    token?.source ?? '',
  )

  const isBtcToken = token?.symbol.includes('BTC')

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ md: 'row', xs: 'column' }}
        width="100%"
      >
        <BigNumberInput
          sx={{
            width: '100%',
            paddingX: 1.5,
            borderBottomLeftRadius: { md: '3px', xs: '0px' },
            borderBottomRightRadius: { md: '3px', xs: '0px' },
          }}
          loading={!token || isFetching}
          error={Boolean(error)}
          decimals={token?.decimals}
          disabled={disabled}
          startAdornment={
            hideStartAdornment ? null : (
              <InputAdornment position="start">
                <Box display="flex" justifyContent="center" alignItems="center">
                  {IconComponent ? (
                    <IconComponent
                      fill={
                        Number(amount) > 0
                          ? theme.palette.text.secondary
                          : theme.palette.text.disabled
                      }
                      width={tokenIconStyle.width}
                      height={tokenIconStyle.height}
                    />
                  ) : (
                    <Skeleton variant="circular" width={24} height={24} />
                  )}

                  {token?.displayName ? (
                    <Typography
                      variant="paragraphBig"
                      color={(theme) => theme.palette.text.gray}
                      ml={1}
                    >
                      {token?.displayName}
                    </Typography>
                  ) : (
                    <Skeleton
                      sx={{ ml: 1 }}
                      variant="rectangular"
                      width={38}
                      height={24}
                    />
                  )}
                </Box>
              </InputAdornment>
            )
          }
          endAdornment={
            <Box display={{ md: 'flex', xs: 'none' }}>
              <InputAdornment position="end">
                {maxAmount && (
                  <MaxAmountSelector
                    disabled={disabled || maxInputDisabled}
                    onMaxClick={onMaxClick}
                    maxAmount={maxAmount ?? BigNumber.from(0)}
                    decimals={token?.decimals}
                    isFetchingMaxAmount={isFetchingMaxAmount}
                    isBtcToken={isBtcToken}
                  />
                )}
              </InputAdornment>
            </Box>
          }
          onChange={onAmountChange}
          value={amount}
        />
        {maxAmount && (
          <Box
            display={{ md: 'none', xs: 'flex' }}
            justifyContent="space-between"
            alignItems="center"
            p={1.5}
            sx={{
              borderBottomRightRadius: '3px',
              borderBottomLeftRadius: '3px',
            }}
          >
            <MaxAmountSelector
              onMaxClick={onMaxClick}
              maxAmount={maxAmount}
              decimals={token?.decimals}
              isFetchingMaxAmount={isFetchingMaxAmount}
              isBtcToken={isBtcToken}
            />
          </Box>
        )}
      </Box>
      {error && (
        <Box pt={1} display="flex" alignItems="center">
          <ErrorIcon fill={theme.palette.error.main} />
          <Typography sx={{ pl: 1 }} variant="caption" color="error">
            {error}
          </Typography>
        </Box>
      )}
    </>
  )
}

export default TokenInput
