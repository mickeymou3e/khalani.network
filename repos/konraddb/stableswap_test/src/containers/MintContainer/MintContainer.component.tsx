import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import { mapToApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.utils'
import ConfirmButton from '@components/buttons/ConfirmButton'
import { Network } from '@constants/Networks'
import { bigNumberToString, TokenSelectorInput } from '@hadouken-project/ui'
import { mintService } from '@libs/services/mint.service'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Paper, Typography } from '@mui/material'
import { IMintRequest } from '@store/mint/mint.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import FeesBox from '@ui/FeesBox'
import HappyReaction from '@ui/HappyReaction'
import ReceiveBox from '@ui/ReceiveBox'

import { useChains, useTokenWithBalances } from './MintContainer.hooks'
import { messages } from './MintContainer.messages'

const MintContainer: React.FC = () => {
  const userAddress = useSelector(walletSelectors.userAddress)

  const { ethChain } = useChains()

  const [mintRequestSuccess, setMintRequestSuccess] = useState<boolean>(false)

  const {
    selectedTokenValue,
    setSelectedTokenValue,
    selectedToken,
    destinationToken,
    destinationTokenValue,
    setDestinationTokenValue,
  } = useTokenWithBalances()

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

  const mint = () => {
    if (!selectedToken || !userAddress || !selectedTokenValue) {
      return
    }

    const payload: IMintRequest = {
      token: selectedToken?.address,
      user: userAddress,
      amount: selectedTokenValue,
    }

    mintService.mint(payload).then(() => {
      setMintRequestSuccess(true)
    })
  }

  useEffect(() => {
    const mintRequestTimeout = setTimeout(() => {
      setMintRequestSuccess(false)
    }, 5000)
    return () => {
      clearTimeout(mintRequestTimeout)
    }
  }, [mintRequestSuccess])

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
      <Paper sx={{ p: 3, mt: 3 }} elevation={2}>
        {selectedToken && (
          <>
            <Typography variant="h4Bold">{messages.SUB_LABEL}</Typography>
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
        {selectedToken && (
          <ConfirmButton
            onClick={mint}
            text={messages.BUTTON_NAME}
            disabled={depositButtonDisabled}
            expectedChainId={Network.Goerli}
            tokensWithAmount={tokensWithAmount}
          />
        )}
      </Paper>
      {mintRequestSuccess && <HappyReaction />}
    </Box>
  )
}

export default MintContainer
