import React from 'react'

import Link from '@components/Link'
import { Typography } from '@mui/material'

import { CustomizedHeaderItem } from './HeaderItem.styled'
import { IHeaderItemProps } from './HeaderItem.typed'

const HeaderItem: React.FC<IHeaderItemProps> = (props) => {
  const { page, routerLink, selected, onClick } = props

  return (
    <Link
      underline="none"
      linkType={page.linkType}
      RouterLink={routerLink}
      searchParams={page.searchParams}
      url={page.href}
      onClick={onClick}
    >
      <CustomizedHeaderItem className={selected ? 'selected' : ''}>
        <Typography variant="body1" color="secondary">
          {page.text}
        </Typography>
      </CustomizedHeaderItem>
    </Link>
  )
}

export default HeaderItem
