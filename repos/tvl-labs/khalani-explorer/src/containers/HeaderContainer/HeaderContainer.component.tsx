import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'

import { Header } from '@tvl-labs/khalani-ui'

import { Routes } from './HeaderContainer.constants'
import { IHeaderContainerProps } from './HeaderContainer.types'

const HeaderContainer: React.FC<IHeaderContainerProps> = () => {
  const history = useHistory()
  const [currentTabId, setCurrentTabId] = useState<string | undefined>()

  const onLogoClick = () => {
    history?.push('/')
  }

  useEffect(() => {
    let currentPath = history.location.pathname
    if (currentPath.includes('add') || currentPath.includes('remove')) {
      currentPath = currentPath.slice(0, location.pathname.lastIndexOf('/'))
    }
    Routes.map((route) => {
      const foundId = route.pages.find(
        (page) =>
          page.href.includes(currentPath) ||
          page.internalHrefs?.includes(currentPath),
      )?.id
      if (foundId) {
        setCurrentTabId(foundId)
      }
    })
  }, [history])

  return (
    <Header
      items={Routes}
      RouterLink={RouterLink}
      onHomeClick={onLogoClick}
      currentTabId={currentTabId}
      showConnectWalletButton={false}
    />
  )
}

export default HeaderContainer
