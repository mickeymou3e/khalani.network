import React, { useState } from 'react'

import { CardList, UserBorrowCard, UserDepositCard } from '@components/cards'
import BorrowPanel from '@components/panels/BorrowPanel'
import DepositPanel from '@components/panels/DepositPanel'
import EmptyPanel from '@components/panels/EmptyPanel'
import { SearchBoxSkeleton } from '@components/skeletons'
import { AssetListSkeleton, ToggleGroup } from '@hadouken-project/ui'
import { Box, Paper, Typography } from '@mui/material'

import { messages, tabs } from './Dashboard.constants'
import { IDashboardMobileProps } from './DashboardMobile.types'

const DashboardMobilePage: React.FC<IDashboardMobileProps> = ({
  balance,
  args,
  deposits,
  borrows,
}) => {
  const [selected, setSelected] = useState<string>(tabs[0].id)

  return (
    <Box>
      <Paper elevation={2}>
        <Typography variant="h2" py={3}>
          {messages.TITLE}
        </Typography>
        <ToggleGroup
          toggles={tabs}
          selected={selected}
          onToggleChange={setSelected}
        />
      </Paper>

      <Box paddingTop={6}>
        {selected === tabs[0].id ? (
          <>
            <Typography
              variant="h1"
              sx={{
                pb: 1,
              }}
            >
              {messages.DEPOSIT_TITLE}
            </Typography>
            {deposits ? (
              <DepositPanel balance={balance} />
            ) : (
              <SearchBoxSkeleton />
            )}
            {deposits ? (
              deposits.length === 0 ? (
                <EmptyPanel
                  text={messages.NO_DEPOSITS}
                  sx={{ marginTop: '1px' }}
                />
              ) : (
                <CardList Component={UserDepositCard} rows={deposits} />
              )
            ) : (
              <AssetListSkeleton rowsCount={1} />
            )}
          </>
        ) : (
          <>
            <Typography variant="h1" sx={{ pb: 1 }}>
              {messages.BORROW_TITLE}
            </Typography>
            {borrows ? <BorrowPanel {...args} /> : <SearchBoxSkeleton />}
            {borrows ? (
              borrows.length === 0 ? (
                <EmptyPanel
                  text={messages.NO_BORROWS}
                  sx={{ marginTop: '1px' }}
                />
              ) : (
                <CardList Component={UserBorrowCard} rows={borrows} />
              )
            ) : (
              <AssetListSkeleton rowsCount={1} />
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default DashboardMobilePage
