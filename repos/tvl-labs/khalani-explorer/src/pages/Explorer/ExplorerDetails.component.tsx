import React from 'react'

import { availableSourceNetworks } from '@constants/Networks'

import ModuleLayout from '../../components/Module/ModuleLayout'
import { Page } from '../../constants/Page'
import ExplorerModule from '../../modules/ExplorerModule'

const ExplorerDetails: React.FC = () => {
  return (
    <ModuleLayout>
      <ExplorerModule
        availableSourceNetworks={availableSourceNetworks}
        page={Page.ExplorerDetails}
      />
    </ModuleLayout>
  )
}

export default ExplorerDetails
