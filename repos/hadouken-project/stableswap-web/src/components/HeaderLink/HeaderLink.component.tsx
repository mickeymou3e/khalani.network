import { Link, LinkEnum } from '@hadouken-project/ui'
import { Typography } from '@mui/material'
import React from 'react'
import { IHeaderLinkProps } from './HeaderLink.types'

const HeaderLink: React.FC<IHeaderLinkProps> = ({ text, href }) => {
  return (
    <Link linkType={LinkEnum.External} url={href}>
      <Typography
        color={(theme) => theme.palette.text.primary}
        variant="buttonSmall"
      >
        <b>{text}</b>
      </Typography>
    </Link>
  )
}

export default HeaderLink
