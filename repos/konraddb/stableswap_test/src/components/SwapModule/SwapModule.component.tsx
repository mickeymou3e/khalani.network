import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { BigNumber } from 'ethers'

import { Page } from '@constants/Page'
import {
  Button,
  CustomizedRadioGroup,
  SwapIcon,
  TokenModelBalance,
  TokenSelectorInput,
} from '@hadouken-project/ui'
import { Box, Divider, Paper, Typography, useTheme } from '@mui/material'
import { useDebounce } from '@utils/hooks'

import { PAGES_PATH } from '../../App'
import { useQuotePrice } from './SwapModule.hooks'
import { messages } from './SwapModule.messages'
import { ISwapModuleProps } from './SwapModule.types'

const QUOTE_PRICE_PRECISION = 3

const DEBOUNCE = 300

const SwapModule: React.FC<ISwapModuleProps> = ({
  tokens,
  slippage,
  swapPossibilities,
  isFetching,
  isFetchingBalances,
  quoteTokenValue,
  onChange,
  onSlippageChange,
}) => {
  const UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens = useMemo(
    () =>
      tokens.map(
        (poolTokenBalance) =>
          ({
            id: poolTokenBalance.id,
            symbol: poolTokenBalance.symbol,
            name: poolTokenBalance.name,
            address: poolTokenBalance.address,
            decimals: poolTokenBalance.decimals,
            balance: poolTokenBalance.balance.toBigNumber(),
          } as TokenModelBalance),
      ),
    [tokens],
  )

  const history = useHistory()
  const theme = useTheme()
  const [baseToken, setBaseToken] = useState<TokenModelBalance | undefined>(
    undefined,
  )
  const [baseTokenValue, setBaseTokenValue] = useState<BigNumber | undefined>(
    undefined,
  )
  const debouncedBaseTokenValue = useDebounce(baseTokenValue, DEBOUNCE)

  const baseTokenOptions = UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens

  const [quoteToken, setQuoteToken] = useState<TokenModelBalance | undefined>(
    undefined,
  )

  useEffect(() => {
    if (baseToken === undefined) {
      setBaseToken(UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens[0])
    } else {
      const newBaseToken = UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens.find(
        (token) => token.id === baseToken?.id,
      )
      setBaseToken(newBaseToken)
      const newQuoteToken = UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens.find(
        (token) => token.id === quoteToken?.id,
      )
      setQuoteToken(newQuoteToken)
    }
  }, [UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens])

  const isSwapRational =
    baseToken &&
    quoteToken &&
    quoteTokenValue &&
    baseTokenValue &&
    !quoteTokenValue.eq(0) &&
    !baseTokenValue.eq(0) &&
    BigNumber.from(100)
      .sub(
        quoteTokenValue
          .mul(BigNumber.from(100))
          .mul(BigNumber.from(10).pow(baseToken.decimals))
          .div(baseTokenValue)
          .div(BigNumber.from(10).pow(quoteToken.decimals)),
      )
      .lte(BigNumber.from(5))

  const [quoteTokenOptions, setQuoteTokenOptions] = useState<
    TokenModelBalance[]
  >([])

  useEffect(() => {
    if (baseToken) {
      const quoteOptions = UI_CONTAINS_APPLICATION_LOGIC_HACK_tokens.filter(
        (token) =>
          swapPossibilities[baseToken?.id]?.find(
            ({ address }) => address === token?.address,
          ),
      )

      setQuoteTokenOptions(quoteOptions)

      if (
        (quoteOptions?.length > 0 &&
          !quoteOptions.find((x) => x.address === quoteToken?.address)) ||
        (quoteOptions?.length > 0 && quoteToken?.address === baseToken.address)
      ) {
        setQuoteToken(quoteOptions[0])
      }
    }
  }, [tokens, baseToken, swapPossibilities, quoteToken])

  const { quotePrice } = useQuotePrice({
    baseTokenDecimals: baseToken?.decimals ?? 0,
    baseTokenValue: baseTokenValue ?? BigNumber.from(0),
    quoteTokenDecimals: quoteToken?.decimals ?? 0,
    quoteTokenValue: quoteTokenValue ?? BigNumber.from(0),
    precision: QUOTE_PRICE_PRECISION,
  })

  useEffect(() => {
    if (baseToken && quoteToken && debouncedBaseTokenValue) {
      onChange?.(baseToken, quoteToken, debouncedBaseTokenValue)
    }
  }, [onChange, debouncedBaseTokenValue, baseToken, quoteToken])

  const onBaseTokenAmountChange = (value: BigNumber | undefined): void => {
    setBaseTokenValue(value)
  }

  const onBaseTokenChange = (token: TokenModelBalance) => {
    setBaseToken(token)
  }

  const onQuoteTokenChange = (token: TokenModelBalance) => {
    setQuoteToken(token)
  }

  const swapBaseAndQuoteTokens = (): void => {
    setBaseToken(quoteToken)
    setBaseTokenValue(quoteTokenValue ?? BigNumber.from(0))
    setQuoteToken(baseToken)
  }

  const onSlippageChangeHandler = (value: number) => {
    onSlippageChange?.(value)
  }

  const onPreviewRequest = () => {
    history.push(PAGES_PATH[Page.SwapPreview])
  }

  const swapDisabled =
    !baseTokenValue ||
    baseTokenValue.eq(BigNumber.from(0)) ||
    Boolean(baseToken?.balance.lt(baseTokenValue)) ||
    !slippage ||
    !quotePrice

  // TODO User after implementing under performance banner
  const swapUnderperformance =
    quoteToken &&
    quoteTokenValue &&
    !quoteTokenValue?.eq(0) &&
    baseToken &&
    baseTokenValue &&
    !baseTokenValue?.eq(0) &&
    !isFetching &&
    !isSwapRational

  return (
    <>
      <Box width={{ xs: '100%', md: 'inherit' }} maxWidth={616}>
        <Paper sx={{ p: 3 }} elevation={3}>
          <Typography variant="h4Bold">{messages.TRADE_LABEL}</Typography>

          <Box pt={3} display="flex" flexDirection="column">
            <Box>
              <TokenSelectorInput
                tokens={baseTokenOptions}
                amount={baseTokenValue}
                selectedToken={baseToken}
                onAmountChange={onBaseTokenAmountChange}
                onTokenChange={onBaseTokenChange}
                isFetching={isFetchingBalances}
              />
            </Box>

            <Box display="flex">
              <Box
                width="100%"
                display="flex"
                ml={2}
                justifyContent="space-between"
              >
                <Button
                  variant="text"
                  onClick={swapBaseAndQuoteTokens}
                  sx={{
                    ...theme.typography.breadCrumbs,
                    color: (theme) => theme.palette.common.white,
                  }}
                  startIcon={
                    <SwapIcon
                      fill={theme.palette.common.white}
                      style={{
                        transform: 'rotate(90deg)',
                      }}
                    />
                  }
                  text={messages.BUTTON_NAME}
                />

                <Box display="flex" justifyContent="flex-end" width="100%">
                  {quotePrice && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Typography
                        variant="paragraphTiny"
                        color={(theme) => theme.palette.text.secondary}
                      >
                        {messages.EXCHANGE_RATE(
                          baseToken?.name ?? '',
                          quoteToken?.name ?? '',
                          quotePrice,
                        )}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box>
              <TokenSelectorInput
                disabled
                tokens={quoteTokenOptions}
                amount={quoteTokenValue}
                selectedToken={quoteToken}
                onTokenChange={onQuoteTokenChange}
                isFetching={isFetchingBalances}
              />
            </Box>
          </Box>

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
                Slippage tolerance
              </Typography>
            </Box>
            <Box width="100%" display="flex" justifyContent="end">
              <CustomizedRadioGroup
                buttonLabel="Custom amount"
                onSlippageChange={onSlippageChangeHandler}
              />
            </Box>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="end">
            <Button
              disabled={swapDisabled}
              onClick={onPreviewRequest}
              size="large"
              variant="contained"
              text="Preview"
            />
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default SwapModule
