import { ActionPattern } from 'redux-saga/effects'
import { cancel, fork, take } from 'typed-redux-saga'

import { Action } from '@reduxjs/toolkit'

export function* takeLatestN<P extends ActionPattern>(
  n: number,
  pattern: P,
  worker: (action: Action<P>) => Generator<unknown, unknown, unknown>,
): Generator<unknown, void, unknown> {
  let lastTask = null
  let counter = n - 1

  while (true) {
    const action = yield* take(pattern)

    if (counter === n - 1) {
      if (lastTask) {
        yield* cancel(lastTask)
        lastTask = null
      }

      lastTask = yield* fork(worker, action)
      counter = 0
    } else {
      counter++
    }
  }
}
