import React from 'react'
import { Outlet } from 'react-router-dom'

import { Module } from '@shared/components'

const Liquidity: React.FC = () => {
  return (
    <Module>
      <Outlet />
    </Module>
  )
}

export default Liquidity
