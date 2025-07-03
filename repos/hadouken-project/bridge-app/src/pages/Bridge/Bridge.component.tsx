import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber, providers } from 'ethers'
import {
  Bridge,
  BridgeFeature,
  Environment,
  IGodwokenBridge,
  useBridge,
  useBridgeRegistry,
} from 'nervos-bridge'

import errorPatternBackgroundImage from '@assets/error-pattern.svg'
import { ReactComponent as CBridgeLink } from '@assets/icons/CBridgeLink.svg'
import { ReactComponent as CBridgeLogo } from '@assets/icons/CBridgeLogo.svg'
import ConfirmModal from '@components/modals/ConfirmModal'
import {
  Button,
  ErrorBanner,
  NetworkSelectorBox,
  Paragraph,
  Selector,
  ToggleGroup,
  TokenSelectorInput,
  WarningBanner,
} from '@hadouken-project/ui'
import {
  ArrowDownIcon,
  SwapRight,
} from '@hadouken-project/ui/dist/components/icons'
import {
  alpha,
  Box,
  Link,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { networkSelectors } from '@store/network/network.selector'
import { networkActions } from '@store/network/network.slice'
import { providerSelectors } from '@store/provider/provider.selectors'
import { StoreDispatch } from '@store/store.types'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'
import { ConnectionState, ConnectionStatus } from '@store/wallet/wallet.types'
import { getGodwokenNetwork, GodwokenNetwork } from '@utils/network'
import {
  convertIntegerDecimalToDecimal,
  removeInsignificantZeros,
} from '@utils/stringOperations'

import Config from '../../config'
import { messages } from './Bridge.messages'
import {
  mapBridgeTokenNames,
  removeDirectionFromSymbol,
  usePushHistoryInternal,
  useQuery,
} from './Bridge.utils'

const BridgeModule: React.FC = () => {
  const dispatch = useDispatch<StoreDispatch>()
  const [addressTranslatorClone, setAddressTranslator] = useState(null)
  const [bridgeEthereumProvider, setEthereumProvider] = useState(null)
  const [tokenMinimumLimitWarning, setTokenMinimumLimitWarning] = useState(null)
  const [open, setOpen] = useState(false)

  const network = getGodwokenNetwork()

  const isConnected = useSelector(walletSelectors.isConnected)
  const selectedNetwork = useSelector(walletSelectors.chainId)
  const expectedNetwork = useSelector(networkSelectors.expectedNetwork)
  const isCorrectNetwork = useSelector(networkSelectors.isCorrectNetwork)

  const addressTranslator = useSelector(providerSelectors.addressTranslator)
  const provider = useSelector(providerSelectors.provider)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { palette } = useTheme()

  const history = usePushHistoryInternal()

  useEffect(() => {
    if (addressTranslator) {
      setAddressTranslator(addressTranslator.clone())
    }
  }, [addressTranslator])

  useEffect(() => {
    if (provider && isConnected && isCorrectNetwork) {
      setEthereumProvider(provider)
    }

    return () => setEthereumProvider(null)
  }, [provider, isConnected, isCorrectNetwork])

  const { bridges, selectedBridge, selectBridge } = useBridgeRegistry({
    environment:
      network === GodwokenNetwork.Testnet
        ? Environment.Testnet
        : Environment.Mainnet,
    addressTranslator: addressTranslatorClone,
    config: {
      godwokenRpcUrl: Config.godwoken.rpcReadOnlyUrl,
      ckbRpcUrl: Config.ckb.ckb.url,
      ckbIndexerUrl: Config.ckb.indexer.url,
      depositLockScriptTypeHash: Config.ckb.depositLockScriptTypeHash,
      rollupTypeHash: Config.ckb.rollupTypeHash,
      ethAccountLockCodeHash: Config.ckb.ethAccountLockCodeHash,
      bridge: {
        ethereum: {
          forceBridge: { url: Config.bridge.ethereum.bridges.forceBridge.url },
        },
        bsc: {
          forceBridge: { url: Config.bridge.bsc.bridges.forceBridge.url },
        },
      },
    },
    defaultBridge: Bridge.OmniBridge,
  })

  const {
    tokens,
    token,
    setToken,
    setValue: setAmount,
    value: amount,
    deposit,
    withdraw,
    selectedFeature,
    setSelectedFeature,
    transactionInProgress,
    error: bridgeError,
    setError,
  } = useBridge({
    bridge: selectedBridge,
    provider: bridgeEthereumProvider,
  })

  const onBridgeChange = (item: IGodwokenBridge<providers.JsonRpcProvider>) => {
    selectBridge(item)
    setAmount(undefined)
    setError(undefined)
    setTokenMinimumLimitWarning(undefined)
  }

  useEffect(() => {
    if (selectedBridge && selectedNetwork && expectedNetwork) {
      if (selectedBridge.id === Bridge.OmniBridge) {
        if (expectedNetwork !== Config.godwoken.chainId) {
          dispatch(
            networkActions.updateExpectedNetwork(Config.godwoken.chainId),
          )
        } else {
          dispatch(
            walletActions.changeConnectionStateStatus({
              connectionState: ConnectionState.ChangeNetwork,
              status: ConnectionStatus.pending,
            }),
          )
        }
      } else if (selectedBridge.id === Bridge.EthereumBridge) {
        if (selectedFeature === BridgeFeature.Deposit) {
          if (expectedNetwork !== Config.bridge.ethereum.chainId) {
            dispatch(
              networkActions.updateExpectedNetwork(
                Config.bridge.ethereum.chainId,
              ),
            )
          } else {
            dispatch(
              walletActions.changeConnectionStateStatus({
                connectionState: ConnectionState.ChangeNetwork,
                status: ConnectionStatus.pending,
              }),
            )
          }
        } else if (selectedFeature === BridgeFeature.Withdraw) {
          if (expectedNetwork !== Config.godwoken.chainId) {
            dispatch(
              networkActions.updateExpectedNetwork(Config.godwoken.chainId),
            )
          } else if (selectedNetwork !== Config.godwoken.chainId) {
            dispatch(
              walletActions.changeConnectionStateStatus({
                connectionState: ConnectionState.ChangeNetwork,
                status: ConnectionStatus.pending,
              }),
            )
          }
        }
      } else if (selectedBridge.id === Bridge.BscBridge) {
        if (selectedFeature === BridgeFeature.Deposit) {
          if (expectedNetwork !== Config.bridge.bsc.chainId) {
            dispatch(
              networkActions.updateExpectedNetwork(Config.bridge.bsc.chainId),
            )
          } else {
            dispatch(
              walletActions.changeConnectionStateStatus({
                connectionState: ConnectionState.ChangeNetwork,
                status: ConnectionStatus.pending,
              }),
            )
          }
        } else if (selectedFeature === BridgeFeature.Withdraw) {
          if (expectedNetwork !== Config.godwoken.chainId) {
            dispatch(
              networkActions.updateExpectedNetwork(Config.godwoken.chainId),
            )
          } else if (selectedNetwork !== Config.godwoken.chainId) {
            dispatch(
              walletActions.changeConnectionStateStatus({
                connectionState: ConnectionState.ChangeNetwork,
                status: ConnectionStatus.pending,
              }),
            )
          }
        }
      }
    }
  }, [
    selectedBridge,
    selectedNetwork,
    expectedNetwork,
    selectedFeature,
    dispatch,
  ])

  const handleSetAmount = (amount: BigNumber) => {
    setAmount(amount)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const onModalConfirm = () => {
    handleClose()
    selectedFeature === BridgeFeature.Deposit ? deposit() : withdraw()
  }

  const bridgeTokens = useMemo(
    () =>
      tokens && tokens.map(removeDirectionFromSymbol).map(mapBridgeTokenNames),
    [tokens],
  )

  const minimumCKBValue =
    amount?.lt(
      BigNumber.from(400).mul(BigNumber.from(10).pow(token?.decimals ?? 0)),
    ) && amount?.gt(0)
  const onToggleChange = (feature: BridgeFeature) => {
    setSelectedFeature(feature)
    history('', `action=${feature.toLowerCase()}`)
  }
  const query = useQuery().get('action')

  useEffect(() => {
    if (query === 'deposit') {
      setSelectedFeature(BridgeFeature.Deposit)
      // TODO bring back when withdraw will be supported
      // } else if (query === 'withdraw') {
      //   setSelectedFeature(BridgeFeature.Withdraw)
    } else {
      setSelectedFeature(BridgeFeature.Deposit)
      history('', `action=deposit`)
    }
  }, [query, setSelectedFeature, history])

  useEffect(() => {
    if (
      token?.minimalBridgeAmount &&
      selectedFeature === BridgeFeature.Deposit
    ) {
      if (amount && token?.minimalBridgeAmount?.gte(amount) && amount.gt(0)) {
        setTokenMinimumLimitWarning(
          `Please enter an amount greater than ${removeInsignificantZeros(
            convertIntegerDecimalToDecimal(
              token.minimalBridgeAmount,
              token.decimals,
            ),
          )} to ensure your bridge deposit goes through.`,
        )
      } else {
        setTokenMinimumLimitWarning(undefined)
      }
    }
  }, [
    token,
    amount,
    selectedBridge,
    selectedNetwork,
    expectedNetwork,
    selectedFeature,
  ])

  return (
    <>
      <Paper elevation={3} sx={{ maxWidth: '616px' }}>
        <ConfirmModal
          open={open}
          handleClose={handleClose}
          title={messages.CONFIRM_TRANSACTION}
          description={messages.CONFIRM_TRANSACTION_DESCRIPTION}
          handleAction={onModalConfirm}
        />
        <Box pb={1}>
          <Paragraph title={messages.SELECT_BRIDGE} />
        </Box>

        {selectedBridge ? (
          <Selector
            title=""
            items={bridges}
            selectedItem={selectedBridge}
            onSelect={onBridgeChange}
            itemRenderer={(modalItem) => {
              const selected = modalItem.id === selectedBridge?.id
              const bridge = bridges.find(
                (bridge) => bridge.id === modalItem.id,
              )

              const { name: depositNetworkName } = bridge?.getDepositNetwork()
              const {
                name: withdrawalNetworkName,
              } = bridge?.getWithdrawalNetwork()
              return (
                <NetworkSelectorBox
                  from={depositNetworkName}
                  to={withdrawalNetworkName}
                  description={modalItem.name}
                  selected={selected}
                />
              )
            }}
          >
            <Box display="flex" justifyContent="space-between" width="100%">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography
                      variant="paragraphSmall"
                      textAlign="center"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {selectedBridge?.getDepositNetwork().name}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    px={1}
                    sx={{
                      transform:
                        selectedFeature === 'Deposit'
                          ? 'rotate(0deg)'
                          : 'rotate(180deg)',
                    }}
                  >
                    <SwapRight fill={palette.common.white} />
                  </Box>
                  <Box display="flex" justifyContent="center" width="100%">
                    <Typography variant="paragraphSmall" textAlign="center">
                      {selectedBridge?.getWithdrawalNetwork().name}
                    </Typography>
                  </Box>
                </Box>
                <Box color={alpha(palette.common.white, 0.3)} lineHeight={1}>
                  <Typography
                    variant="paragraphTiny"
                    textAlign="left"
                    lineHeight="0px"
                  >
                    {selectedBridge?.name}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <ArrowDownIcon />
              </Box>
            </Box>
          </Selector>
        ) : (
          <Box
            height="100%"
            border={`1px solid ${alpha(palette.text.secondary, 0.3)}`}
          >
            <Skeleton variant="rectangular" width="100%" height={53} />
          </Box>
        )}
        <Box pt={2} pb={1}>
          <Paragraph title={messages.FEATURE_TITLE} />
        </Box>

        <ToggleGroup
          selected={selectedFeature}
          disabled={!selectedBridge}
          toggles={[
            {
              id: BridgeFeature.Deposit,
              name: 'Deposit',
            },
            {
              id: BridgeFeature.Withdraw,
              name: 'Withdraw',
              disabled: true,
            },
          ]}
          onToggleChange={onToggleChange}
        />
        {
          <Box pt={2} pb={1}>
            <Paragraph
              title={messages.SELECT_ASSET}
              description={
                transactionInProgress && messages.SELECT_ASSET_DESCRIPTION
              }
            />
          </Box>
        }
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          width="100%"
        >
          <Box width="100%" height="100%">
            <TokenSelectorInput
              amount={amount}
              tokens={bridgeTokens}
              selectedToken={token && mapBridgeTokenNames(token)}
              onAmountChange={handleSetAmount}
              error={
                (selectedBridge?.id === Bridge.OmniBridge && minimumCKBValue
                  ? messages.TOKEN_INPUT_ERROR
                  : undefined) || bridgeError
              }
              onTokenChange={(tokenModel) => {
                const token = tokens.find(
                  (token) => token.address === tokenModel.address,
                )
                setToken({
                  ...tokenModel,
                  balance: token.balance,
                  network: token.network,
                })
              }}
            />
          </Box>
          <Box pt={3} display="flex" width="100%" justifyContent="flex-end">
            <Button
              sx={{ minWidth: 120 }}
              variant="contained"
              size="medium"
              text={
                selectedFeature === BridgeFeature.Deposit
                  ? messages.DEPOSIT_BUTTON
                  : messages.WITHDRAW_BUTTON
              }
              disabled={
                selectedFeature === BridgeFeature.Withdraw ||
                amount === undefined ||
                amount === null ||
                amount.lte(BigNumber.from(0)) ||
                token === undefined ||
                token.balance === undefined ||
                amount.gt(token.balance) ||
                (selectedBridge?.id === Bridge.OmniBridge &&
                  selectedFeature === BridgeFeature.Deposit &&
                  token?.symbol === 'CKB' &&
                  amount.gt(0) &&
                  minimumCKBValue) ||
                Boolean(bridgeError)
              }
              isFetching={transactionInProgress}
              onClick={
                token?.address === Config.bridge.ethereum.tokens.USDC
                  ? handleOpen
                  : selectedFeature === BridgeFeature.Deposit
                  ? deposit
                  : withdraw
              }
            />
          </Box>
        </Box>
        {tokenMinimumLimitWarning && (
          <Box mt={2}>
            <WarningBanner title={tokenMinimumLimitWarning} description={''} />
          </Box>
        )}
        {selectedFeature === BridgeFeature.Withdraw && (
          <Box mt={2}>
            <ErrorBanner
              backgroundImageUrl={errorPatternBackgroundImage}
              noFill={isMobile}
              text={messages.WITHDRAW_DISABLED}
            />
          </Box>
        )}
      </Paper>

      <Box mt={2.5}>
        <Paper elevation={3} sx={{ maxWidth: '616px' }}>
          <Box display="flex" flexDirection="row" alignItems="center" gap={3}>
            <Box width="76px">
              <CBridgeLogo />
            </Box>
            <Box>
              <Typography variant="paragraphSmall">
                {messages.CBRIDGE_TITLE}
              </Typography>
              <Typography variant="paragraphTiny" color="darkgrey">
                {messages.CBRIDGE_DESCRIPTION}
              </Typography>
            </Box>

            <Link
              href="https://cbridge.celer.network/"
              target="_blank"
              color="inherit"
              sx={{ textDecoration: 'none' }}
            >
              <Button
                variant="text"
                text={
                  <Box display="flex" alignItems="center">
                    {messages.CBRIDGE_BUTTON_TITLE}
                    <Box ml={1} mt={0.5}>
                      <CBridgeLink />
                    </Box>
                  </Box>
                }
                sx={{
                  padding: '5px 10px',
                  textTransform: 'none',
                  width: '146px',
                  height: '32px',
                  '&:hover': {
                    border: (theme) => `1px solid ${theme.palette.text.gray}`,
                  },
                  border: (theme) =>
                    `1px solid ${theme.palette.background.backgroundBorder}`,
                }}
              />
            </Link>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default BridgeModule
