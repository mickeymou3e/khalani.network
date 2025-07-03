import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { address } from '@dataSource/graph/utils/formatters'
import {
  ToggleGroup,
  convertNumberToStringWithCommas,
  getTokenIconWithChainComponent,
} from '@hadouken-project/ui'
import { Paper, Box, Typography, Divider } from '@mui/material'
import { lockdropSelectors } from '@store/lockDrop/lockDrop.selector'
import { networkSelectors } from '@store/network/network.selector'
import { config } from '@utils/network'

import { DEPOSIT_TOGGLES } from '../Lockdrop.constants'
import { MESSAGES } from '../Lockdrop.messages'

export const LockdropDepositBalance: React.FC = () => {
  const [selectedToggle, setSelectedToggle] = useState(DEPOSIT_TOGGLES[0].id)
  const depositTokens = useSelector(lockdropSelectors.phaseTwoDepositTokens)
  const applicationChainId = useSelector(networkSelectors.applicationChainId)

  const onToggleChange = (toggleId: string) => {
    setSelectedToggle(toggleId)
  }

  const isAllDepositsSelected = selectedToggle === DEPOSIT_TOGGLES[1].id

  const {
    totalPriceTokenDepositBalance,
    totalHdkDepositBalance,
    userPriceTokenDepositBalance,
    userHdkDepositBalance,
    userSharePriceTokenInPercentage,
    userShareHdkInPercentage,
  } = useSelector(lockdropSelectors.phaseTwoDepositBalances)

  return (
    <Paper sx={{ marginTop: 2 }}>
      <Box>
        <Box>
          <Typography variant="h4Bold">
            {MESSAGES.DEPOSIT_BALANCE_TITLE}
          </Typography>
          <Box mt={2}>
            <Typography
              variant="paragraphTiny"
              color={(theme) => theme.palette.text.gray}
            >
              {MESSAGES.DEPOSIT_BALANCE_DESCRIPTION}
            </Typography>
          </Box>
        </Box>
        <Box my={2}>
          <ToggleGroup
            toggles={DEPOSIT_TOGGLES}
            selected={selectedToggle}
            onToggleChange={onToggleChange}
          />
        </Box>
        <Divider variant="fullWidth" />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={1}
        >
          <Typography
            flex="40%"
            fontWeight="bolder"
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.ASSET}
          </Typography>
          <Typography
            flex="25%"
            fontWeight="bolder"
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.BALANCE}
          </Typography>

          <Typography
            flex="25%"
            textAlign="right"
            fontWeight="bolder"
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.gray}
          >
            {MESSAGES.YOUR_SHARE}
          </Typography>
        </Box>

        {depositTokens.map((token) => {
          const Icon = getTokenIconWithChainComponent(token.symbol)

          const isHDK =
            address(token.address) ===
            address(config.lockDropTokens[applicationChainId].Hdk)

          const userTokenDepositBalance = isHDK
            ? userHdkDepositBalance
            : userPriceTokenDepositBalance

          const totalDepositTokenBalance = isHDK
            ? totalHdkDepositBalance
            : totalPriceTokenDepositBalance

          const userShares = isHDK
            ? userShareHdkInPercentage
            : userSharePriceTokenInPercentage

          return (
            <Box
              key={token.address}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Box display="flex" alignItems="center" flex="40%">
                <Box>
                  <Icon height={32} width={32} />
                </Box>
                <Box ml={1}>
                  <Typography fontWeight="bolder">{token.symbol}</Typography>
                </Box>
              </Box>
              <Box flex="25%">
                <Typography variant="paragraphSmall">
                  {isAllDepositsSelected
                    ? convertNumberToStringWithCommas(
                        totalDepositTokenBalance.toNumber(),
                        4,
                        false,
                      )
                    : convertNumberToStringWithCommas(
                        userTokenDepositBalance.toNumber(),
                        4,
                        false,
                      )}
                </Typography>
              </Box>
              <Box flex="25%">
                <Typography
                  variant="paragraphSmall"
                  textAlign="right"
                  color={(theme) => theme.palette.tertiary.main}
                >
                  {userShares.toFixed(2)}%
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}
