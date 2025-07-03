import React, { useState } from 'react'

import { BigNumber } from 'ethers'

import DefaultModule from '@components/DefaultModule/DefaultModule.component'
import LayoutModule from '@components/Module/ModuleLayout'
import Toggle from '@components/Toggle'
import { Paragraph, SlippageInput, TokenInput } from '@hadouken-project/ui'
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, Theme, useTheme } from '@mui/material/styles'
import { tokens } from '@tests/tokens'

import PoolParameterSkeleton from './PoolParameterSkeleton.component'

const PoolContainerSkeleton: React.FC = () => {
  const { palette, spacing } = useTheme()
  const upMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  const toggles = [
    {
      id: '1',
      name: 'Deposit',
    },
    {
      id: '2',
      name: 'Withdraw',
    },
  ]
  const token = tokens[0]

  const [slippage, setSlippage] = useState<number | undefined>(1)

  const [amount, setAmount] = useState<BigNumber | undefined>(BigNumber.from(0))

  return (
    <Box>
      <LayoutModule>
        <Box marginBottom={0.5}>
          <Typography variant="h2">Loading pool...</Typography>
        </Box>
        <Divider />
        <Box mt={2}>
          <Paper elevation={2}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              width="100%"
            >
              <Box
                display="flex"
                flexDirection="row"
                width="100%"
                border={`3px solid ${alpha(palette.primary.main, 0.2)}`}
              >
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Box>
            </Box>
            <Box display="flex" flexDirection="row-reverse">
              <Box display="flex" flexDirection="column" marginY={3}>
                <Box
                  px={2}
                  py={0.5}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box ml={1} mr={2.5}>
                    <Skeleton variant="text" width={180} height={20} />
                  </Box>
                </Box>
                <Box
                  px={2}
                  py={0.5}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box ml={1} mr={2.5}>
                    <Skeleton variant="text" width={180} height={20} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={1}>
            <Box
              display="flex"
              flexDirection={upMd ? 'row' : 'column'}
              alignContent="center"
              justifyContent="space-between"
              paddingY={2}
            >
              <PoolParameterSkeleton />
              <PoolParameterSkeleton />
              <Divider orientation="vertical" />
              <PoolParameterSkeleton />
              <PoolParameterSkeleton />
              <PoolParameterSkeleton />
              <PoolParameterSkeleton />
            </Box>
          </Paper>
        </Box>
      </LayoutModule>
      <DefaultModule title={'What action do you want to perform?'}>
        <Toggle toggles={toggles} />
      </DefaultModule>

      <Box marginBottom={0.5}>
        <Typography variant="h2">Deposit</Typography>
      </Box>
      <Divider />

      <LayoutModule>
        <Paper>
          <Box marginBottom={1} width="100%">
            <Paragraph
              paddingTop={0}
              title={'How much of each token you want to deposit?'}
              description={
                'Amount you will enter will be recalculated into amount of pool you will get:'
              }
            />
          </Box>

          <Box marginY={4} width="100%">
            <Box marginBottom={2}>
              <Box>
                <Box mb={2}>
                  <TokenInput
                    amount={amount}
                    onAmountChange={(amount) => setAmount(amount)}
                    token={{
                      id: token.address,
                      address: token.address,
                      symbol: token.symbol,
                      name: token.symbol,
                      decimals: token.decimals,
                    }}
                  />
                </Box>
                <TokenInput
                  amount={amount}
                  onAmountChange={(amount) => setAmount(amount)}
                  token={{
                    id: token.address,
                    address: token.address,
                    symbol: token.symbol,
                    name: token.symbol,
                    decimals: token.decimals,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </LayoutModule>
      <DefaultModule
        title={'Slippage'}
        description={
          'Selecting slippage option will present minimal values user will get in target tokens.'
        }
      >
        <SlippageInput
          onChange={(slippage) => setSlippage(slippage ?? undefined)}
          slippage={slippage}
        />
      </DefaultModule>

      <Box pt={6} pb={6}>
        <Box mb={spacing(0.25)}>
          <Typography variant="h2">{'Deposit summary'}</Typography>
          <Typography color="primary" variant="paragraphSmall">
            {'Presented values have slippage applied.'}
          </Typography>
          <Divider />
        </Box>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Box flex="50%" display="flex" marginRight={{ xs: 0, md: 1 }}>
            <Paper>
              <Box minHeight={140} />
            </Paper>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            marginX={{ xs: 0, md: -4 }}
            mt={{ xs: 0, md: '34px' }}
            justifyContent={{ xs: 'center', md: 'inherit' }}
            zIndex={1000}
          >
            <Box
              height={64}
              width={64}
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                borderRadius: 60,
                backgroundColor: palette.primary.dark,
              }}
            >
              <CircularProgress
                style={{
                  height: 32,
                  width: 32,
                }}
                color="primary"
              />
            </Box>
          </Box>
          <Box flex="50%" display="flex" marginRight={{ xs: 0, md: 1 }}>
            <Paper>
              <Box minHeight={140} />
            </Paper>
          </Box>
        </Box>
      </Box>
      <Box mt={2} display="flex" justifyContent="center" textAlign="center">
        <Typography variant="caption" color="primary">
          {
            'The amount of the tokens received depends on the equilibrium of the tokens in the pool.'
          }
          <br />
          {`If you want to get the best deal for yourself while depositing your tokens please keep an eye on the pool's total deposited assets overview.`}
        </Typography>
      </Box>
    </Box>
  )
}

export default PoolContainerSkeleton
