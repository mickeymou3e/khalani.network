import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import InternalTabsSelector from '@ui/InternalTabsSelector'

import { tabs } from './MintHeader.constants'

const MintHeader: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>()

  const history = useHistory()

  useEffect(() => {
    const foundTab = tabs.find((tab) =>
      history.location.pathname.includes(tab.route),
    )
    setSelectedTab(foundTab?.value)
  }, [history])

  const navigate = (path: string) => {
    history.push(`/${path}`)
  }

  return (
    <>
      {(selectedTab || selectedTab === 0) && (
        <InternalTabsSelector
          tabs={tabs}
          onChange={navigate}
          selectedTab={selectedTab}
        />
      )}
    </>
  )
}

export default MintHeader
