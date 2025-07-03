import React from 'react'

import ModuleLayout from '@components/Module/ModuleLayout'
import ModuleTitle from '@components/Module/ModuleTitle'
import SummaryCard from '@components/SummaryCard'
import { Box, CircularProgress, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import DirectionIcon from './DirectionIcon'
import { ISummaryModuleProps } from './SummaryModule.type'

const SummaryModule: React.FC<ISummaryModuleProps> = ({
  title,
  description,
  sendLabel,
  receiveLabel,
  sendTokens,
  receiveTokens,
  sendAdditionalLabel,
  receiveAdditionalLabel,
  isFetching,
  errorMessage,
  sendWarning,
}) => {
  const { palette } = useTheme()
  return (
    <ModuleLayout>
      <ModuleTitle title={title} subtitle={description} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} style={{ zIndex: 1 }}>
          <SummaryCard
            label={sendLabel}
            tokens={sendTokens}
            isFetching={isFetching}
            additionalLabel={sendAdditionalLabel}
            error={sendWarning}
          />
        </Grid>
        <Grid
          item
          container
          xs={12}
          md
          zeroMinWidth
          style={{ zIndex: 2, padding: 0 }}
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            {/* <Box marginX={-4} className={classes.rotation}> */}
            <Box
              height={64}
              width={64}
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                borderRadius: 64,
                backgroundColor: palette.primary.main,
              }}
            >
              {isFetching ? (
                <CircularProgress
                  style={{
                    height: 32,
                    width: 32,
                  }}
                  color="secondary"
                />
              ) : (
                <DirectionIcon width={32} height={32} />
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} style={{ zIndex: 1 }}>
          <SummaryCard
            label={receiveLabel}
            tokens={receiveTokens}
            isFetching={isFetching}
            additionalLabel={receiveAdditionalLabel}
          />
        </Grid>
      </Grid>
      {/* {errorMessage && <ErrorLabel>{errorMessage}</ErrorLabel>} */}
    </ModuleLayout>
  )
}

export default SummaryModule
