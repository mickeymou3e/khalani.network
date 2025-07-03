import React from 'react'

import { ActionInProgressBanner as ActionInProgressBannerUI } from '@hadouken-project/ui'

import { IActionInProgressBannerProps } from './ActionInProgressBanner.types'

export const ActionInProgressBanner: React.FC<IActionInProgressBannerProps> = ({
  actionInProgress,
  currentAction,
}) => {
  return (
    <ActionInProgressBannerUI
      inProgress={
        (actionInProgress && actionInProgress !== currentAction) ?? false
      }
      actionName={actionInProgress?.toString()}
    />
  )
}

export default ActionInProgressBanner
