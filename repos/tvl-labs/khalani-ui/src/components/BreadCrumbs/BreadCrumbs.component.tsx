import React from 'react'

import Link, { LinkEnum } from '@components/Link'
import { Typography } from '@mui/material'
import MuiBreadCrumbs from '@mui/material/Breadcrumbs'

import { IBreadCrumbsProps } from './BreadCrumbs.types'

const BreadCrumbs: React.FC<IBreadCrumbsProps> = ({ items, RouterLink }) => {
  return (
    <MuiBreadCrumbs>
      {items.map((item, index) => (
        <Link
          sx={{
            cursor: item.href ? 'pointer' : 'initial',
            display: 'inline-flex',
          }}
          key={item.id}
          linkType={item.linkType ?? LinkEnum.Button}
          RouterLink={RouterLink}
          url={item.href ?? ''}
          underline="none"
        >
          <Typography
            color={(theme) =>
              index + 1 === items.length
                ? theme.palette.text.secondary
                : theme.palette.text.primary
            }
            variant="body1"
          >
            {' '}
            {item.text}
          </Typography>
        </Link>
      ))}
    </MuiBreadCrumbs>
  )
}
export default BreadCrumbs
