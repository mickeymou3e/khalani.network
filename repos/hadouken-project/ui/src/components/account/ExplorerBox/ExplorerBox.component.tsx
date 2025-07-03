import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import Button from '@components/buttons/Button'
import { Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { testIds } from '@utils/dataTestIds'
import { getAddressLabel } from '@utils/text'

import { IExplorerBoxProps } from './ExplorerBox.types'

const ExplorerBox: React.FC<IExplorerBoxProps> = ({
  address,
  networkName,
  explorers,
}) => {
  const handleCopyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box width="75%">
          <Typography variant="paragraphSmall" pb={1.5}>
            {networkName}
          </Typography>
          <Typography
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.secondary}
          >
            {address ? (
              getAddressLabel(address)
            ) : (
              <Skeleton height="30px" width="80%" />
            )}
          </Typography>
        </Box>

        <Box
          display="flex"
          width="100%"
          flexDirection="column"
          alignItems="end"
        >
          {explorers.map((explorer) => (
            <Box key={explorer.name}>
              <Link
                data-testid={testIds.FAUCET_LINK}
                sx={{
                  textDecoration: 'none',
                  background: 'unset',
                }}
                linkType={LinkEnum.External}
                url={explorer.url}
                key={explorer.name}
              >
                <Button
                  sx={{
                    justifyContent: 'end',
                    width: '100%',
                    height: '18px',
                    color: (theme) => theme.palette.text.quaternary,
                    textTransform: 'none',
                  }}
                  text={explorer.name}
                  variant="text"
                  fullWidth
                />
              </Link>
            </Box>
          ))}

          <Button
            text="Copy to clipboard"
            onClick={handleCopyToClipboard}
            variant="text"
            sx={{
              height: '18px',
              color: (theme) => theme.palette.text.quaternary,
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: '125%',
              textTransform: 'none',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ExplorerBox
