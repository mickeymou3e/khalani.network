import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { BreadCrumbs } from '@hadouken-project/ui'

import { useBreadCrumbs } from './BreadCrumbContainer.hooks'

const BreadCrumbContainer: React.FC = () => {
  const breadCrumbs = useBreadCrumbs()

  return <BreadCrumbs RouterLink={RouterLink} items={breadCrumbs} />
}

export default BreadCrumbContainer
