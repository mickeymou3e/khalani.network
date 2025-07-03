import React from 'react'

import ModuleLayout from '@components/Module/ModuleLayout'
import DepositModule from '@modules/DepositModule'

const Deposit: React.FC = () => {
  return (
    <ModuleLayout>
      <DepositModule />
    </ModuleLayout>
  )
}

export default Deposit
