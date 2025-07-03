import { LocationDescriptor, LocationState } from 'history'

import { createAction } from '@reduxjs/toolkit'
import { ActionsType } from '@store/store.types'

export enum Router {
  HISTORY_PUSH = 'HISTORY_PUSH',
  LOCATION_CHANGED = 'LOCATION_CHANGED',
}

export const routerActions = {
  historyPush: createAction<LocationDescriptor>(Router.HISTORY_PUSH),
  locationChanged: createAction<LocationState>(Router.LOCATION_CHANGED),
}

export type RouterActions = ActionsType<typeof routerActions>
