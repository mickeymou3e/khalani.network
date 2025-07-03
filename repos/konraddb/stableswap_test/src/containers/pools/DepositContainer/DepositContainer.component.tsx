import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BigNumber } from 'ethers'

import DepositPreviewContainer from '@containers/DepositPreview'
import {
  Button,
  CustomizedRadioGroup,
  Modal,
  ModalHeader,
  TokenInput,
} from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { userBalancesSelectors } from '@store/balances/selectors/user/balances.selector'
import { depositActions } from '@store/deposit/deposit.slice'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { pricesSelector } from '@store/prices/prices.selector'
import { StoreDispatch } from '@store/store.types'
import { BigDecimal } from '@utils/math'

import { messages } from './DepositContainer.messages'

export interface IDepositContainer {
  poolId: string
}

const DepositContainer: React.FC<IDepositContainer> = ({ poolId }) => {
  const dispatch = useDispatch<StoreDispatch>()

  const isFetching = useSelector(poolsModelsSelector.isFetching)

  const [showProportionalForToken, setShowProportionalForToken] = useState<
    string | null
  >(null)

  const [slippage, setSlippage] = useState(0)
  const [open, setOpen] = useState(false)

  const [depositAmounts, setDepositAmounts] = useState<
    { value: BigDecimal; tokenAddress: string }[]
  >([])

  const selectUserTokensBalances = useSelector(
    userBalancesSelectors.selectUserTokensBalances,
  )
  const selectPricesByIds = useSelector(pricesSelector.selectManyByIds)
  const selectPoolModelById = useSelector(poolsModelsSelector.selectById)
  const poolModel = selectPoolModelById(poolId)

  const depositTokens = useMemo(() => poolModel?.depositTokens ?? [], [
    poolModel?.depositTokens,
  ])

  const prices =
    depositTokens &&
    selectPricesByIds(depositTokens.map(({ address }) => address))

  const totalDepositValueUSD =
    depositAmounts
      ?.map((amount, index) => {
        const price = prices?.[index]?.price ?? BigDecimal.from(0)
        const amountUSD = amount.value.mul(price)

        return amountUSD
      })
      .reduce(
        (totalDepositValueUSD, amount) => totalDepositValueUSD.add(amount),
        BigDecimal.from(0),
      ) ?? BigDecimal.from(0)

  const depositTokensBalances = selectUserTokensBalances(
    depositTokens?.map(({ address }) => address),
  )

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (poolModel) {
      setDepositAmounts(
        poolModel.depositTokens.map((token) => ({
          tokenAddress: token.address,
          value: BigDecimal.from(0, token.decimals),
        })),
      )
    }
  }, [poolModel])

  const setDepositTokenAmount = useCallback(
    (amount: BigNumber, tokenAddress: IToken['address']) => {
      setDepositAmounts(
        depositAmounts.map((previousDepositAmount) => {
          if (previousDepositAmount.tokenAddress === tokenAddress) {
            return {
              tokenAddress: tokenAddress,
              value: BigDecimal.from(
                amount ?? 0,
                previousDepositAmount.value.decimals,
              ),
            }
          }
          return previousDepositAmount
        }),
      )

      if (amount.gt(0)) {
        setShowProportionalForToken(tokenAddress)
      } else if (tokenAddress === showProportionalForToken) {
        setShowProportionalForToken(null)
      }
    },
    [depositTokens, depositAmounts],
  )

  const setDepositTokenAmounts = useCallback(
    (amount: BigNumber[], tokenAddress: IToken['address'][]) => {
      const newDepositAmounts = depositAmounts.map(
        (previousDepositAmount, index) => {
          const depositToken = depositTokens[index]
          const currentIndex = tokenAddress.findIndex(
            (address) => address === depositToken.address,
          )

          if (currentIndex !== -1) {
            return {
              value: BigDecimal.from(
                amount[currentIndex] ?? BigNumber.from(0),
                depositToken.decimals,
              ),
              tokenAddress: depositToken.address,
            }
          }
          return previousDepositAmount
        },
      )

      setDepositAmounts(newDepositAmounts)
    },
    [depositTokens, depositAmounts],
  )

  const getDepositTokenAmount = useCallback(
    (tokenAddress: IToken['address']) => {
      return depositAmounts.find(
        (depositAmount) => depositAmount.tokenAddress === tokenAddress,
      )
    },
    [depositTokens, depositAmounts],
  )

  const onDepositPreviewRequest = () => {
    handleOpen()
    dispatch(
      depositActions.depositPreviewRequest({
        poolId: poolId,
        inTokens: depositAmounts.map(
          (depositAmount) => depositAmount.tokenAddress,
        ),
        inTokensAmounts: depositAmounts.map(
          (depositAmount) => depositAmount.value,
        ),
        slippage,
      }),
    )
  }

  const calculateProportional = (
    inputTokenValue: BigDecimal,
    inputTokenTotalBalance: BigDecimal,
    tokenForProportionalCalculationTotalBalance: BigDecimal,
  ): BigDecimal => {
    return inputTokenValue
      .mul(tokenForProportionalCalculationTotalBalance)
      .div(
        inputTokenTotalBalance,
        tokenForProportionalCalculationTotalBalance.decimals,
      )
  }

  const onInputFocus = (tokenAddress: string) => {
    const depositTokenBalance = getDepositTokenAmount(tokenAddress)
    if (depositTokenBalance && depositTokenBalance.value.toBigNumber().gt(0)) {
      setShowProportionalForToken(tokenAddress)
    } else {
      setShowProportionalForToken(null)
    }
  }

  const onProportionalSuggestionRequest = (tokenAddress: string) => {
    const inputToken = poolModel?.pool?.tokens.find(
      (token) => token.address === tokenAddress,
    )

    if (inputToken) {
      const inputValue =
        getDepositTokenAmount(tokenAddress)?.value ?? BigDecimal.from(0)

      const restTokens = poolModel?.pool?.tokens.filter(
        (token) => token.address !== tokenAddress,
      )

      if (restTokens) {
        const newDepositAmounts: { address: string; value: BigNumber }[] = []

        for (const token of restTokens) {
          const value = calculateProportional(
            inputValue,
            inputToken.balance,
            token.balance,
          )

          newDepositAmounts.push({
            address: token.address,
            value: value.toBigNumber(),
          })
        }

        setDepositTokenAmounts(
          newDepositAmounts.map((depositAmount) => depositAmount.value),
          newDepositAmounts.map((depositAmount) => depositAmount.address),
        )
      }
    }
  }

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
              {isFetching && (
                <Box>
                  <Box pb={3}>
                    <TokenInput isFetchingMaxAmount={true} />
                  </Box>
                  <Box pb={3}>
                    <TokenInput isFetchingMaxAmount={true} />
                  </Box>
                </Box>
              )}
              {!isFetching &&
                depositTokens?.map(
                  ({ id, address: tokenAddress, name, symbol, decimals }) => {
                    const userTokenBalance =
                      depositTokensBalances?.[tokenAddress]

                    const showProportional =
                      showProportionalForToken === tokenAddress

                    return (
                      <Box
                        onFocus={() => onInputFocus(tokenAddress)}
                        pb={showProportional ? 0 : 4}
                        key={id}
                      >
                        <TokenInput
                          maxAmount={
                            userTokenBalance
                              ? userTokenBalance.toBigNumber()
                              : BigNumber.from(0)
                          }
                          onMaxRequest={(address) =>
                            setDepositTokenAmount(
                              userTokenBalance
                                ? userTokenBalance.toBigNumber()
                                : BigNumber.from(0),
                              address,
                            )
                          }
                          amount={
                            getDepositTokenAmount(
                              tokenAddress,
                            )?.value.toBigNumber() ?? BigNumber.from(0)
                          }
                          onAmountChange={(amount) => {
                            const previousAmount = getDepositTokenAmount(
                              tokenAddress,
                            )

                            if (
                              !amount ||
                              !previousAmount?.value.toBigNumber().eq(amount)
                            ) {
                              setDepositTokenAmount(
                                amount ?? BigNumber.from(0),
                                tokenAddress,
                              )
                            }
                          }}
                          token={{
                            address: tokenAddress,
                            decimals,
                            name,
                            symbol,
                            id,
                          }}
                        />
                        {showProportional && (
                          <Box
                            display="flex"
                            height={32}
                            pr={2}
                            width="100%"
                            alignItems="center"
                            textAlign="end"
                          >
                            <Typography
                              onClick={() =>
                                onProportionalSuggestionRequest(tokenAddress)
                              }
                              color="text.quaternary"
                              variant="paragraphTiny"
                              sx={{
                                cursor: 'pointer',
                                ml: 'auto',
                                '&:hover': {
                                  color: (theme) =>
                                    theme.palette.tertiary.light,
                                },
                              }}
                            >
                              Proportional suggestion
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )
                  },
                )}
              <Box pt={3} display="flex" alignItems="center">
                <Typography sx={{ width: '100%' }} variant="paragraphTiny">
                  {messages.SLIPPAGE_TOLERANCE_LABEL}
                </Typography>
                <Box width="100%" display="flex" justifyContent="end">
                  <CustomizedRadioGroup
                    buttonLabel={messages.CUSTOM_PERCENTAGE_ITEM_LABEL}
                    onSlippageChange={setSlippage}
                  />
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box display="flex" justifyContent="end" alignItems="center">
              <Box mr={2}>
                <Typography textAlign="right" variant="h5">
                  {`${messages.TOTAL_DEPOSIT} ${totalDepositValueUSD.toFixed(
                    2,
                  )}$`}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                disabled={
                  depositAmounts.some((amount, index) => {
                    const depositToken = depositTokens?.[index]
                    const tokenBalance =
                      depositTokensBalances?.[depositToken?.address]

                    return tokenBalance?.lt(amount.value)
                  }) ||
                  !depositAmounts.some((amount) =>
                    amount.value?.toBigNumber().gt(0),
                  )
                }
                text={messages.DEPOSIT_PREVIEW_BUTTON_LABEL}
                onClick={onDepositPreviewRequest}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
      <Modal open={open} handleClose={handleClose}>
        <ModalHeader title={messages.INVESTMENT_PREVIEW_LABEL} />
        <DepositPreviewContainer onClose={handleClose} crossChain={false} />
      </Modal>
    </Box>
  )
}

export default DepositContainer
