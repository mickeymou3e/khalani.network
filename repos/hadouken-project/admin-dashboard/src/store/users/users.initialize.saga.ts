import { put, call } from 'typed-redux-saga'

import { fetchUsersData } from './action/fetchUsers'
import { usersActions } from './users.slice'

export function* initializeUsersSaga(): Generator {
  try {
    yield* put(usersActions.fetchUsersRequest())
    const users = yield* call(fetchUsersData)
    yield* put(usersActions.fetchUsersSuccess(users))
  } catch (error) {
    yield* put(usersActions.fetchUsersFailure())
    console.error(error)
  }
}
