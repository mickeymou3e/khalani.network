import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { BigNumber } from 'ethers'

import { mapToApprovalToken } from '@components/buttons/ApproveButton/ApproveButton.utils'
import ConfirmButton from '@components/buttons/ConfirmButton'
import { Network } from '@constants/Networks'
import { PAN } from '@dataSource/graph/pools/poolsTokens/constants'
import { bigNumberToString, TokenSelectorInput } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'
import { IChain } from '@store/chains/chains.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { lockActions } from '@store/lock/lock.slice'
import { ILockRequest } from '@store/lock/lock.types'
import { networkActions } from '@store/network/network.slice'
import { StoreDispatch } from '@store/store.types'
import DoubleButton from '@ui/DoubleButton'
import SwapIconButton from '@ui/SwapIconButton'
import { BigDecimal } from '@utils/math'

import { lockService } from '../../libs/services/lock.service'
import ChainSelector from '../../ui/ChainSelector/ChainSelector.component'
import ReceiveBox from '../../ui/ReceiveBox/ReceiveBox.component'
import { useChains, useTokenWithBalances } from './LockModule.hooks'
import { messages } from './LockModule.messages'
import Settings from './components/Settings/Settings.component'
import WithdrawalAddress from './components/WithdrawalAddress/WithdrawalAddress.component'

const LockModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()

  const {
    chains,
    originChain,
    availableOriginChains,
    destinationChain,
    setDestinationChain,
    availableDesinationChains,
    setDesinationOriginChains,
  } = useChains()

  const {
    allTokens,
    onlyChainIdWithTokens,
    selectableTokens,
    selectedTokenValue,
    setSelectedTokenValue,
    originToken,
    setOriginToken,
    destinationToken,
    setDestinationToken,
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
    !originChain ||
    !selectedTokenValue ||
    originChain?.chainId === destinationChain?.chainId ||
    selectedTokenValue.gt(originToken?.balance || BigNumber.from(0))

  const availableOriginTokens = useMemo(
    () =>
      selectableTokens?.sort((a, b) =>
        a.balance.lt(b.balance) ? 1 : a.balance.gt(b.balance) ? -1 : 0,
      ),
    [selectableTokens],
  ) as ITokenModelBalanceWithChain[]

  const availableDestinationTokens = useMemo(() => [destinationToken], [
    destinationToken,
  ]) as ITokenModelBalanceWithChain[]

  useEffect(() => {
    const hasNotTokenWithBalance = availableOriginTokens.every((originToken) =>
      originToken.balance.isZero(),
    )
    if (hasNotTokenWithBalance) {
      const foundPANToken = availableOriginTokens.find((token) =>
        token.symbol.includes(PAN.symbol),
      )
      if (foundPANToken) {
        setOriginToken(foundPANToken)
      }
    } else {
      setOriginToken(availableOriginTokens[0])
    }
  }, [availableOriginTokens, setOriginToken])

  useEffect(() => {
    if (!allTokens || !destinationChain) {
      return
    }

    const newDestinationToken = allTokens.find(
      (i) =>
        i.chainId === destinationChain.chainId &&
        (i.symbol === originToken?.symbol ||
          (![Network.GodwokenTestnet, Network.Axon].includes(i.chainId) &&
            originToken?.symbol.includes('USDC') &&
            i.symbol.includes('USDC'))),
    )

    setDestinationToken(newDestinationToken)
  }, [allTokens, originToken, destinationChain, setDestinationToken])

  useEffect(() => {
    if (onlyChainIdWithTokens) {
      dispatch(networkActions.updateExpectedNetwork(onlyChainIdWithTokens))
    }
  }, [onlyChainIdWithTokens, dispatch])

  const handleOriginTokenChange = (token: ITokenModelBalanceWithChain) => {
    setOriginToken(token)
  }

  const onBaseTokenAmountChange = (value: BigNumber | undefined): void => {
    setSelectedTokenValue(value)
    setDestinationTokenValue(
      value ? value.sub(BigNumber.from(10).pow(17)) : undefined,
    )
  }

  const handleOriginChainChange = (chain: IChain) => {
    if (chain === destinationChain) {
      if (originChain) {
        dispatch(lockActions.updateDestinationChain(originChain.chainId))
      }
    }
    dispatch(networkActions.updateExpectedNetwork(chain.chainId))
  }

  const handleDestinationChainChange = (chain: IChain) => {
    if (chain === originChain) {
      if (destinationChain) {
        dispatch(networkActions.updateExpectedNetwork(destinationChain.chainId))
        dispatch(lockActions.updateDestinationChain(chain.chainId))
      }
    } else {
      const availableChains = chains?.filter(
        (availableChain) => availableChain.chainId !== chain.chainId,
      )

      if (availableChains) {
        setDesinationOriginChains(availableChains)
        setDestinationChain(chain)
      }
    }
  }

  const deposit = () => {
    if (!originToken) {
      return
    }
    const payload: ILockRequest = {
      user: '0x653456',
      token: originToken.address,
      amount: new BigDecimal(BigNumber.from('42'), 5),
      destinationChain: originChain?.chainId,
    }
    dispatch(lockActions.lockRequest(payload))
    lockService.deposit(payload)
  }

  const handleSwapButtonClick = () => {
    if (destinationChain && originChain) {
      dispatch(networkActions.updateExpectedNetwork(destinationChain.chainId))
      dispatch(lockActions.updateDestinationChain(originChain.chainId))
    }
  }

  const tokensWithAmount = useMemo(() => {
    if (originToken) {
      return [
        mapToApprovalToken(
          originToken,
          selectedTokenValue ?? BigNumber.from(0),
        ),
      ]
    }
  }, [originToken, selectedTokenValue])

  return (
    <Box maxWidth={616} margin="0 auto">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4Bold">{messages.LABEL}</Typography>
        <DoubleButton
          primaryLabel={messages.SETTINGS_LABEL}
          secondaryLabel={messages.CLOSE_LABEL}
          onClick={toggleDrawer(!openDrawer)}
        />
      </Box>
      <Paper sx={{ p: 3, mt: 3, position: 'relative' }} elevation={2}>
        <Typography variant="h4Bold">{messages.SUB_LABEL}</Typography>
        <Box pt={3}>
          {availableOriginChains && originChain && (
            <ChainSelector
              label={messages.ORIGIN_CHAIN_LABEL}
              chains={availableOriginChains}
              selectedChain={originChain}
              handleChainClick={handleOriginChainChange}
            />
          )}
        </Box>
        <Box marginTop={2}>
          <Box display="flex" flexDirection="column">
            {originToken && (
              <TokenSelectorInput
                tokens={availableOriginTokens}
                amount={selectedTokenValue}
                selectedToken={originToken}
                onAmountChange={onBaseTokenAmountChange}
                onTokenChange={handleOriginTokenChange}
              />
            )}
          </Box>
        </Box>
        <SwapIconButton onClick={handleSwapButtonClick} />
        <Box pt={2}>
          {availableDesinationChains && destinationChain && (
            <ChainSelector
              label={messages.DESTINATION_CHAIN_LABEL}
              chains={availableDesinationChains}
              selectedChain={destinationChain}
              handleChainClick={handleDestinationChainChange}
            />
          )}
        </Box>
        <Box marginTop={2}>
          <Box display="flex" flexDirection="column">
            {destinationToken && (
              <TokenSelectorInput
                disabled
                tokens={availableDestinationTokens}
                amount={destinationTokenValue}
                selectedToken={destinationToken}
              />
            )}
          </Box>
        </Box>
        {destinationToken && destinationAmount && destinationChain && (
          <Box mt={4}>
            <ReceiveBox
              amount={Number(destinationAmount)}
              tokenSymbol={destinationToken.symbol}
              chainLogo={destinationChain.logo}
            />
          </Box>
        )}
        {showWithdrawalAddress && (
          <WithdrawalAddress
            destinationChainName={destinationChain?.chainName}
            onAddressChange={changeWithdrawalAddress}
          />
        )}

        {originChain && originToken && tokensWithAmount && (
          <ConfirmButton
            onClick={deposit}
            text={messages.BUTTON_NAME}
            disabled={depositButtonDisabled}
            expectedChainId={originChain.chainId}
            tokensWithAmount={tokensWithAmount}
          />
        )}
        {openDrawer && (
          <Settings
            showWithdrawalAddress={showWithdrawalAddress}
            toggleWithdrawalAddress={toggleWithdrawalAddress}
          />
        )}
      </Paper>
    </Box>
  )
}

export default LockModule
