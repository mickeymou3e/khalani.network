import React from 'react'
import { Outlet } from 'react-router-dom'

import { Module } from '@shared/components'

const MTokens: React.FC = () => {
  return (
    <Module>
      <Outlet />
    </Module>
  )
}

export default MTokens
