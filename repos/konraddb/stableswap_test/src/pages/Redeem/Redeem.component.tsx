import React from 'react'

import ModuleLayout from '@components/Module/ModuleLayout'
import { Page } from '@constants/Page'
import MintRedeemModule from '@modules/MintRedeemModule'

const Redeem: React.FC = () => {
  return (
    <ModuleLayout>
      <MintRedeemModule page={Page.Redeem} />
    </ModuleLayout>
  )
}

export default Redeem
