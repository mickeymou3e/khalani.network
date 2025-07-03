import React from 'react'

import ModuleLayout from '@components/Module/ModuleLayout'
import { Page } from '@constants/Page'
import MintRedeemModule from '@modules/MintRedeemModule'

const Mint: React.FC = () => {
  return (
    <ModuleLayout>
      <MintRedeemModule page={Page.Mint} />
    </ModuleLayout>
  )
}

export default Mint
