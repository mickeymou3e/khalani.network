import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { mapToApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.utils'
import ConfirmButton from '@components/buttons/ConfirmButton'
import { Network } from '@constants/Networks'
import {
  bigNumberToString,
  Button,
  TokenSelectorInput,
} from '@hadouken-project/ui'
import { redeemService } from '@libs/services/redeem.service'
import Settings from '@modules/LockModule/components/Settings/Settings.component'
import WithdrawalAddress from '@modules/LockModule/components/WithdrawalAddress/WithdrawalAddress.component'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, Paper, Typography } from '@mui/material'
import { walletSelectors } from '@store/wallet/wallet.selector'
import FeesBox from '@ui/FeesBox'
import ReceiveBox from '@ui/ReceiveBox'

import { useChains, useTokenWithBalances } from './RedeemContainer.hooks'
import { messages } from './RedeemContainer.messages'
import { IRedeemRequest } from './RedeemContainer.types'

const RedeemContainer: React.FC = () => {
  const userAddress = useSelector(walletSelectors.userAddress)

  const { ethChain } = useChains()

  const {
    selectedTokenValue,
    setSelectedTokenValue,
    selectedToken,
    destinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  } = useTokenWithBalances()

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen)
  }

  const [withdrawalAddress, setWithdrawalAddress] = useState<string>()
  const changeWithdrawalAddress = (address: string) => {
    setWithdrawalAddress(address)
  }

  const [showWithdrawalAddress, setShowWithdrawalAddress] = useState<boolean>(
    false,
  )
  const toggleWithdrawalAddress = () => {
    setShowWithdrawalAddress(!showWithdrawalAddress)
  }

  const destinationAmount =
    destinationTokenValue && bigNumberToString(destinationTokenValue, 18)

  const depositButtonDisabled =
    !selectedTokenValue ||
    (selectedToken?.balance && selectedTokenValue.gt(selectedToken.balance)) ||
    selectedTokenValue.eq(0)

  const onBaseTokenAmountChange = (value: BigNumber | undefined): void => {
    setSelectedTokenValue(value)
    setDestinationTokenValue(
      value ? value.sub(BigNumber.from(10).pow(17)) : undefined,
    )
  }

  const redeem = () => {
    if (!selectedToken || !userAddress || !selectedTokenValue) {
      return
    }

    const payload: IRedeemRequest = {
      token: selectedToken?.address,
      user: userAddress,
      amount: selectedTokenValue,
    }

    redeemService.redeem(payload)
  }

  const tokensWithAmount = useMemo(() => {
    if (selectedToken) {
      return [
        mapToApprovalToken(
          selectedToken,
          selectedTokenValue ?? BigNumber.from(0),
        ),
      ]
    }
  }, [selectedToken, selectedTokenValue])

  return (
    <Box margin="0 auto">
      <Paper sx={{ p: 3, mt: 3, position: 'relative' }} elevation={2}>
        {selectedToken && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4Bold">{messages.SUB_LABEL}</Typography>
              <Button
                text={messages.SETTINGS_LABEL}
                size="small"
                variant="outlined"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={toggleDrawer(!openDrawer)}
              ></Button>
            </Box>
            <Box pt={3}>
              <Typography variant="breadCrumbs" sx={{ opacity: 0.7 }}>
                {messages.ORIGIN_TITLE}
              </Typography>
            </Box>
            <Box marginTop={2}>
              <Box display="flex" flexDirection="column">
                <TokenSelectorInput
                  tokens={[selectedToken]}
                  amount={selectedTokenValue}
                  selectedToken={selectedToken}
                  onAmountChange={onBaseTokenAmountChange}
                />
              </Box>
            </Box>
          </>
        )}
        <ArrowDownwardIcon sx={{ mt: 2, ml: 5 }} />
        <Box marginTop={2}>
          {destinationToken && (
            <TokenSelectorInput
              disabled
              tokens={[destinationToken]}
              amount={destinationTokenValue}
              selectedToken={destinationToken}
            />
          )}
        </Box>
        {destinationAmount && <FeesBox platformFee={5} gasFee={2} />}
        {destinationToken && destinationAmount && ethChain && (
          <Box mt={2}>
            <ReceiveBox
              amount={Number(destinationAmount)}
              tokenSymbol={destinationToken.symbol}
              chainLogo={ethChain.logo}
            />
          </Box>
        )}
        {showWithdrawalAddress && (
          <WithdrawalAddress
            destinationChainName={messages.CHAIN_NAME}
            onAddressChange={changeWithdrawalAddress}
          />
        )}
        {selectedToken && (
          <ConfirmButton
            onClick={redeem}
            text={messages.BUTTON_NAME}
            disabled={depositButtonDisabled}
            expectedChainId={Network.Goerli}
            tokensWithAmount={tokensWithAmount}
          />
        )}
        {openDrawer && (
          <Settings
            showWithdrawalAddress={showWithdrawalAddress}
            toggleWithdrawalAddress={toggleWithdrawalAddress}
            toggleDrawer={toggleDrawer(!openDrawer)}
          />
        )}
      </Paper>
    </Box>
  )
}

export default RedeemContainer
