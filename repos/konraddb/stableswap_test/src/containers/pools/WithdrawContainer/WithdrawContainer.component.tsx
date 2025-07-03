import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import PercentageSlider from '@components/PercentageSlider/PercentageSlider.component'
import WithdrawPreviewContainer from '@containers/WithdrawPreview'
import {
  Button,
  CustomizedRadioGroup,
  getTokenIconComponent,
  Modal,
  ModalHeader,
  TokenModelBalanceWithIcon,
  TokenSelectorInput,
} from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { Box, Divider, Paper, Skeleton, Typography } from '@mui/material'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'
import { userBalancesValuesUSDSelectors } from '@store/pricedBalances/selectors/user/balancesValuesUSD.selector'
import { StoreDispatch } from '@store/store.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { withdrawActions } from '@store/withdraw/withdraw.slice'
import { IWithdrawType } from '@store/withdraw/withdraw.types'
import { BigDecimal } from '@utils/math'

import { SLIPPAGE_DEFAULT_VALUE } from '../constants'
import { messages } from './WithdrawContainer.messages'
import { IWithdrawContainer } from './WithdrawContainer.types'

const WithdrawTokenPreview: React.FC<{
  symbol: string
  balance: string
  valueUSD: string
}> = ({ symbol, balance, valueUSD }) => {
  const TokenIcon = getTokenIconComponent(symbol)

  return (
    <Box
      display="flex"
      p={2}
      alignItems="center"
      bgcolor={(theme) => theme.palette.background.default}
    >
      {TokenIcon ? (
        <TokenIcon height={40} width={40} />
      ) : (
        <Skeleton height={40} width={40} />
      )}
      <Box
        ml={2}
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="paragraphBig">{symbol}</Typography>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="paragraphSmall">{balance}</Typography>
          <Typography variant="paragraphTiny" color="text.gray">
            ${valueUSD}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const WithdrawContainer: React.FC<IWithdrawContainer> = ({ poolId }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const [open, setOpen] = useState(false)

  const [slippage, setSlippage] = useState(SLIPPAGE_DEFAULT_VALUE)
  const [percentage, setPercentage] = useState(30)

  const [withdrawAmounts, setWithdrawAmounts] = useState<BigDecimal[]>([])

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )

  const selectTokenBalance = useSelector(balancesSelectors.selectTokenBalance)
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolModel = selectPoolModelById(poolId)

  const withdrawTokens = poolModel?.depositTokens
  const withdrawTokensBalances =
    withdrawTokens &&
    selectUserTokensBalances(withdrawTokens?.map(({ address }) => address))

  const selectTokenById = useSelector(tokenSelectors.selectById)
  const poolToken = poolModel && selectTokenById(poolModel.address)

  const userAddress = useSelector(walletSelectors.userAddress)
  const userPoolTokenBalance =
    poolToken &&
    userAddress &&
    selectTokenBalance(userAddress, poolToken?.address)

  const selectUserTotalPoolValueUSD = useSelector(
    userBalancesValuesUSDSelectors.selectUserTotalPoolValueUSD,
  )

  const userTotalPoolValueUSD = selectUserTotalPoolValueUSD(poolId)

  const selectUserPoolUnderlyingBalances = useSelector(
    userBalancesSelectors.selectUserPoolUnderlyingBalances,
  )

  const selectUserPoolUnderlyingValuesUSD = useSelector(
    userBalancesValuesUSDSelectors.selectUserPoolUnderlyingValuesUSD,
  )

  const userPoolUnderlyingBalances = selectUserPoolUnderlyingBalances(poolId)
  const userPoolUnderlyingValuesUSD = selectUserPoolUnderlyingValuesUSD(poolId)

  const allTokensItem: TokenModelBalanceWithIcon | null = withdrawTokens
    ? {
        balance: BigNumber.from(0),
        address: '0x243',
        decimals: 18,
        name: 'All',
        symbol: 'ALL',
        id: '122453',
        icon: (
          <Box>
            {withdrawTokens?.map(({ id, symbol }) => {
              const Icon = getTokenIconComponent(symbol)
              return <Icon key={id} />
            })}
          </Box>
        ),
      }
    : null

  const proportionalWithdrawBalances =
    userPoolUnderlyingBalances &&
    Object.keys(userPoolUnderlyingBalances).reduce(
      (proportionalWithdrawBalances, token) => {
        const underlyingBalance = userPoolUnderlyingBalances[token]

        return {
          ...proportionalWithdrawBalances,
          [token]: underlyingBalance?.mul(BigDecimal.from(percentage, 2)),
        }
      },
      {} as IBalance['balances'],
    )

  const withdrawTokensItems: TokenModelBalanceWithIcon[] = withdrawTokens
    ? withdrawTokens.map(
        (token): TokenModelBalanceWithIcon => {
          const tokenBalance = proportionalWithdrawBalances?.[token.address]
          return {
            id: token.id,
            symbol: token.symbol,
            name: token.name,
            address: token.address,
            decimals: token.decimals,
            balance:
              tokenBalance
                ?.toBigNumber()
                .mul(BigNumber.from(10).pow(token.decimals))
                .div(BigNumber.from(10).pow(tokenBalance.decimals)) ??
              BigNumber.from(0),
          }
        },
      )
    : []

  const proportionalWithdrawValuesUSD =
    userPoolUnderlyingValuesUSD &&
    Object.keys(userPoolUnderlyingValuesUSD).reduce(
      (proportionalWithdrawValueUSD, token) => {
        const underlyingBalance = userPoolUnderlyingValuesUSD[token]

        return {
          ...proportionalWithdrawValueUSD,
          [token]: underlyingBalance?.mul(BigDecimal.from(percentage, 2)),
        }
      },
      {} as IBalance['balances'],
    )

  const withdrawPoolTokenAmount =
    userPoolTokenBalance &&
    poolToken &&
    userPoolTokenBalance?.mul(BigDecimal.from(percentage, 2))

  const withdrawUserTotalPoolValueUSD =
    userTotalPoolValueUSD?.mul(BigDecimal.from(percentage, 2)) ??
    BigDecimal.from(0)

  const withdrawTokensItemsWithAll =
    withdrawTokens && withdrawTokens?.length > 0 && allTokensItem
      ? [allTokensItem]
      : []

  const [
    selectedToken,
    setSelectedToken,
  ] = useState<TokenModelBalanceWithIcon>()

  useEffect(() => {
    const initWithdrawTokenItem = withdrawTokensItemsWithAll[0]
    if (withdrawTokensItemsWithAll[0]) {
      setSelectedToken(initWithdrawTokenItem)
    }
    /* TODO: all selectors providing not value, but selector function break rendering
            through new object value returned from selector function
     */
  }, [JSON.stringify(withdrawTokens), JSON.stringify(withdrawTokensBalances)])

  useEffect(() => {
    if (poolModel) {
      setWithdrawAmounts(poolModel?.depositTokens.map(() => BigDecimal.from(0)))
    }
  }, [poolModel])

  const setWithdrawTokenAmount = useCallback(
    (tokenAddress: IToken['address'], amount?: BigNumber) => {
      const withdrawTokenIndex = withdrawTokens?.findIndex(
        ({ address }) => address === tokenAddress,
      )
      const withdrawToken =
        withdrawTokens && (withdrawTokenIndex || withdrawTokenIndex === 0)
          ? withdrawTokens[withdrawTokenIndex]
          : null

      if (withdrawToken) {
        setWithdrawAmounts(
          withdrawAmounts.map((oldAmount, index) => {
            if (index === withdrawTokenIndex) {
              return BigDecimal.from(
                amount ?? BigNumber.from(0),
                withdrawToken.decimals,
              )
            }
            return oldAmount
          }),
        )
      }
    },
    [withdrawTokens, withdrawAmounts],
  )

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleWithdrawPreviewRequest = () => {
    handleOpen()
    if (withdrawPoolTokenAmount) {
      dispatch(
        withdrawActions.withdrawPreviewRequest({
          poolId,
          inToken: poolToken.address,
          inTokenAmount: withdrawPoolTokenAmount,
          outTokens: poolModel.depositTokens.map(({ address }) => address),
          type: IWithdrawType.ExactIn,
          slippage,
          outTokensAmounts: [], // TODO ?
        }),
      )
    }
  }

  const onTokenChange = (token: TokenModelBalanceWithIcon) => {
    setSelectedToken(token)
  }

  // const onGoBack = () => {
  //   history.goBack()
  // }

  return (
    <Box>
      <Box pl={3} pb={2} display="flex" alignItems="center">
        <Typography variant="h1">{messages.TITLE}</Typography>
      </Box>
      <Box>
        <Box pb={6}>
          <Paper
            elevation={3}
            sx={{
              paddingX: { xs: 2, md: 3 },
            }}
          >
            <Box pt={3}>
              <Box pb={3}>
                <TokenSelectorInput
                  tokens={withdrawTokensItemsWithAll}
                  selectedToken={selectedToken}
                  onTokenChange={onTokenChange}
                  disabled={selectedToken?.symbol === 'ALL'}
                  onAmountChange={(amount) => {
                    if (selectedToken) {
                      setWithdrawTokenAmount(selectedToken.address, amount)
                    }
                  }}
                />
              </Box>
              {selectedToken?.symbol === 'ALL' && (
                <Box width="100%">
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="paragraphTiny">
                        {messages.PROPORTIONAL_WITHDRAW}
                      </Typography>
                      <Typography variant="paragraphTiny">{`${percentage}%`}</Typography>
                    </Box>
                    <PercentageSlider
                      value={percentage}
                      onChange={setPercentage}
                    />
                  </Box>
                  {withdrawTokensItems.map(
                    ({ id, decimals, symbol, balance }) => {
                      return (
                        <Box pt={2} key={id}>
                          <WithdrawTokenPreview
                            symbol={symbol}
                            balance={BigDecimal.from(
                              balance,
                              decimals,
                            ).toString()}
                            valueUSD={
                              proportionalWithdrawValuesUSD?.[id]?.toFixed(2) ??
                              '0.00'
                            }
                          />
                        </Box>
                      )
                    },
                  )}
                </Box>
              )}
              <Box
                pt={3}
                display="flex"
                alignItems="center"
                flexDirection={{ xs: 'column', md: 'row' }}
              >
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  width={{ xs: '100%', md: '20%' }}
                  py={{ xs: 2, md: 0 }}
                >
                  <Typography variant="paragraphTiny">
                    {messages.SLIPPAGE_TOLERANCE}
                  </Typography>
                </Box>
                <Box width="100%" display="flex" justifyContent="end">
                  <CustomizedRadioGroup
                    buttonLabel={messages.CUSTOM_AMOUNT}
                    onSlippageChange={setSlippage}
                  />
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box display="flex" justifyContent="end">
              <Box mr={2}>
                <Typography textAlign="right" variant="h5">
                  Total ${withdrawUserTotalPoolValueUSD.toFixed(2)}
                </Typography>
                {/*<Box display="flex" alignItems="center">*/}
                {/*  <Typography variant="paragraphTiny" color="text.gray">*/}
                {/*    Price impact 0.00%*/}
                {/*  </Typography>*/}
                {/*  <InfoIcon*/}
                {/*    sx={{*/}
                {/*      color: (theme) => theme.palette.tertiary.main,*/}
                {/*      ml: 1,*/}
                {/*    }}*/}
                {/*  />*/}
                {/*</Box>*/}
              </Box>
              <Button
                variant="contained"
                size="large"
                text="Preview"
                onClick={handleWithdrawPreviewRequest}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Modal open={open} handleClose={handleClose}>
        <ModalHeader title={messages.TITLE} />
        <WithdrawPreviewContainer onClose={handleClose} />
      </Modal>
    </Box>
  )
}

export default WithdrawContainer
