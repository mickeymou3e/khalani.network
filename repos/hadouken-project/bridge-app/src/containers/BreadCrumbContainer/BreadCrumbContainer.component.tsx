import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { BreadCrumbs, LinkEnum } from '@hadouken-project/ui'
import { Box } from '@mui/material'

import { useQuery } from '../../pages/Bridge/Bridge.utils'

const useBreadCrumbs = () => {
  const query = useQuery().get('action')

  if (query === 'deposit') {
    return [
      {
        id: 'bridge',
        text: 'Bridge',
        href: '',
        linkType: LinkEnum.Button,
      },
      {
        id: 'deposit',
        text: 'Deposit',
        href: null,
        linkType: LinkEnum.Button,
      },
    ]
  }
  if (query === 'withdraw')
    return [
      {
        id: 'bridge',
        text: 'Bridge',
        href: null,
        linkType: LinkEnum.Button,
      },
      {
        id: 'withdraw',
        text: 'Withdraw',
        href: null,
        linkType: LinkEnum.Button,
      },
    ]

  return []
}

const BreadCrumbContainer: React.FC = () => {
  const breadCrumbs = useBreadCrumbs()
  return (
    <Box minHeight={28}>
      <BreadCrumbs RouterLink={RouterLink} items={breadCrumbs} />
    </Box>
  )
}

export default BreadCrumbContainer
