import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import Button from '@components/buttons/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { testIds } from '@utils/dataTestIds'
import { getAddressLabel } from '@utils/text'

import { IAddressBoxProps } from './AddressBox.types'

const AddressBox: React.FC<IAddressBoxProps> = ({
  name,
  address,
  explorerName,
  explorerAddress,
}) => {
  const handleCopyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Box>
          <Typography variant="paragraphSmall">{name}</Typography>
          <Typography
            variant="paragraphSmall"
            color={(theme) => theme.palette.text.secondary}
          >
            {getAddressLabel(address)}
          </Typography>
        </Box>
        <Box width="100%">
          <Button
            sx={{
              justifyContent: 'end',
              width: '100%',
              height: '18px',
              color: (theme) => theme.palette.text.quaternary,
              fontWeight: '500',
              fontSize: '14px',
              lineHeight: '125%',
            }}
            text="Copy to clipboard"
            onClick={handleCopyToClipboard}
            variant="text"
          />

          {explorerAddress && explorerName && (
            <Link
              data-testid={testIds.FAUCET_LINK}
              sx={{
                width: '100%',
                textDecoration: 'none',
                background: 'unset',
              }}
              linkType={LinkEnum.External}
              url={explorerAddress}
            >
              <Button
                sx={{
                  justifyContent: 'end',
                  width: '100%',
                  height: '18px',
                  color: (theme) => theme.palette.text.quaternary,
                }}
                text={explorerName}
                variant="text"
              />
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AddressBox
