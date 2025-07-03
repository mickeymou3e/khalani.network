import React from 'react'

import ModuleLayout from '../../components/Module/ModuleLayout'
import { availableSourceNetworks } from '../../constants/Networks'
import { Page } from '../../constants/Page'
import ExplorerModule from '../../modules/ExplorerModule'

const Explorer: React.FC = () => {
  return (
    <ModuleLayout>
      <ExplorerModule
        availableSourceNetworks={availableSourceNetworks}
        page={Page.ExplorerList}
      />
    </ModuleLayout>
  )
}

export default Explorer
