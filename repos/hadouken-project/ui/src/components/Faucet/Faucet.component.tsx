import React, { ReactElement, useEffect, useState } from 'react'

import { BigNumber } from 'ethers'

import Table from '@components/Table'
import { createIconCell } from '@components/Table/Table.utils'
import { Box } from '@mui/material'
import { usePrevious } from '@utils/hooks'
import { getTokenIconWithChainComponent } from '@utils/icons'

import { Button, ButtonLayout, Modal, Paragraph, TokenInput } from '..'
import { messages } from './Faucet.messages'
import { columns } from './Faucet.table'
import { FaucetToken, IFaucetProps } from './Faucet.types'

export const Faucet: React.FC<IFaucetProps> = ({
  tokens,
  inProgress,
  onMintRequest,
}) => {
  const prevState = usePrevious(inProgress)

  const [amount, setAmount] = useState(BigNumber.from(0))
  const [selectedToken, setSelectedToken] = useState<FaucetToken | null>(null)

  useEffect(() => {
    if (inProgress === false && prevState === true) {
      setSelectedToken(null)
      setAmount(BigNumber.from(0))
    }
  }, [inProgress, prevState])

  const rows = tokens.map((token) => {
    const IconComponent = getTokenIconWithChainComponent(
      token.symbol,
      token.source,
    )

    return {
      id: token.address,
      cells: {
        assets: {
          value: createIconCell(
            token.icon ?? ((<IconComponent height={48} />) as ReactElement),
            token.symbol,
          ),
          sortingValue: token.symbol,
        },
      },
    }
  })

  const onRowClick = (address: string) => {
    const token = tokens.find((token) => token.address === address)
    if (token) {
      setSelectedToken(token)
    }
  }

  const onMintTokenRequest = () => {
    if (selectedToken) {
      onMintRequest?.(selectedToken.address, amount)
    }
  }

  const onAmountChange = (amount: BigNumber) => {
    setAmount(amount)
  }

  const onCloseModal = () => {
    setAmount(BigNumber.from(0))
    setSelectedToken(null)
  }

  return (
    <>
      <Box p={1} height="100%">
        <Table columns={columns} rows={rows} onRowClick={onRowClick} />
      </Box>

      {selectedToken && (
        <Modal open={Boolean(selectedToken)} handleClose={onCloseModal}>
          <Box
            pt={2}
            alignItems="start"
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
          >
            <Paragraph
              title={messages.MINT_TITLE}
              description={messages.MINT_DESCRIPTION}
              textAlign={{ xs: 'center', md: 'left' }}
            />
            <Box
              py={(theme) => ({ xs: theme.spacing(2), md: theme.spacing(3) })}
            >
              <TokenInput
                token={selectedToken ?? undefined}
                amount={amount}
                onAmountChange={onAmountChange}
                disabled={inProgress}
              />
            </Box>
          </Box>

          <ButtonLayout mt={{ xs: 'auto', md: 3 }}>
            <Button
              variant="contained"
              size="large"
              isFetching={inProgress}
              text={messages.MINT}
              onClick={onMintTokenRequest}
              sx={{ width: '100%' }}
            />
            <Button
              variant="text"
              size="large"
              text={messages.CANCEL}
              onClick={onCloseModal}
              sx={{ width: '100%' }}
            />
          </ButtonLayout>
        </Modal>
      )}
    </>
  )
}

export default Faucet
