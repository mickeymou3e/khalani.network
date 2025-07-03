import React from 'react'

import { ActionInProgressBanner as ActionInProgressBannerUI } from '@hadouken-project/ui'

import { IActionInProgressBannerProps } from './ActionInProgressBanner.types'

export const ActionInProgressBanner: React.FC<IActionInProgressBannerProps> = ({
  actionInProgress,
  currentAction,
}) => {
  return (
    <ActionInProgressBannerUI
      inProgress={Boolean(
        actionInProgress && actionInProgress !== currentAction,
      )}
      actionName={actionInProgress?.toString()}
    />
  )
}

export default ActionInProgressBanner
