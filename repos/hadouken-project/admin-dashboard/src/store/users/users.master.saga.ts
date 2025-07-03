import { all, takeEvery } from 'typed-redux-saga'

import { fetchUsersData } from './action/fetchUsers'
import { usersActions } from './users.slice'

export function* usersMasterSaga(): Generator {
  yield all([takeEvery(usersActions.fetchUsersRequest.type, fetchUsersData)])
}
