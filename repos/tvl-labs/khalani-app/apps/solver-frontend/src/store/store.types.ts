import { ActionCreator, AnyAction } from '@reduxjs/toolkit'

import { rootReducer } from './root.reducer'
import { store } from './store'

type ActionsBasicType = {
  [k: string]: ActionCreator<AnyAction>
}

export type ActionsType<actions extends ActionsBasicType> = {
  [k in keyof actions]: ReturnType<actions[k]>
}

export type StoreState = ReturnType<typeof rootReducer>

export type StoreDispatch = typeof store.dispatch

export type CreatedSelectors<SelectedState> = {
  [Key in keyof SelectedState]: (state: SelectedState) => SelectedState[Key]
}
