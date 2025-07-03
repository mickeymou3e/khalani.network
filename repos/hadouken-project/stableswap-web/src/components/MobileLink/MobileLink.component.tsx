import { Link, LinkEnum } from '@hadouken-project/ui'
import { Divider, Typography } from '@mui/material'
import React from 'react'

import { IMobileLinkProps } from './MobileLink.types'

const MobileLink: React.FC<IMobileLinkProps> = ({ text, href }) => {
  return (
    <>
      <Link linkType={LinkEnum.External} url={href}>
        <Typography color="textPrimary" variant="buttonMedium" component="h2">
          {text}
        </Typography>
      </Link>
      <Divider />
    </>
  )
}

export default MobileLink
