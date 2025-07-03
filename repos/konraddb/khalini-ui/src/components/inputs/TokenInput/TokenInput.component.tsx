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
import { getTokenIconComponent } from '@utils/icons'

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
}) => {
  const theme = useTheme()
  const onMaxClick = useCallback(() => {
    if (token) {
      onMaxRequest?.(token.address)
    }
  }, [onMaxRequest, token])

  const IconComponent = getTokenIconComponent(token?.symbol)

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
          loading={!token}
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
                    />
                  ) : (
                    <Skeleton variant="circular" width={24} height={24} />
                  )}

                  {token?.symbol ? (
                    <Typography
                      variant="paragraphBig"
                      color={(theme) => theme.palette.text.gray}
                      sx={{
                        textTransform: 'uppercase',
                      }}
                      ml={1}
                    >
                      {token?.symbol}
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
                    disabled={disabled}
                    onMaxClick={onMaxClick}
                    maxAmount={maxAmount ?? BigNumber.from(0)}
                    decimals={token?.decimals}
                    isFetchingMaxAmount={isFetchingMaxAmount}
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
