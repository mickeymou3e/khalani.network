import { call, put, select } from 'typed-redux-saga'

import { DAY, HOUR, MINUTE, SECOND } from '@utils/date'

import { lockdropSelectors } from '../lockDrop.selector'
import { lockDropActions } from '../lockDrop.slice'

const DAY_MILLISECOND = DAY * 1000
const HOUR_MILLISECOND = HOUR * 1000
const MINUTE_MILLISECOND = MINUTE * 1000
const SECOND_MILLISECOND = SECOND * 1000

export function getCurrentDate(): number {
  return new Date().getTime()
}

export function* updateLockDropTimer(): Generator {
  const phaseEndTime = yield* select(lockdropSelectors.lockdropPhaseEndTime)

  if (!phaseEndTime) throw new Error('Phase Duration not defined')

  const phaseEndDate = new Date(phaseEndTime * 1000)

  const currentDate = yield* call(getCurrentDate)

  const timeDifference = phaseEndDate.getTime() - currentDate

  if (timeDifference <= 0) {
    yield* put(
      lockDropActions.updateTimerSuccess({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }),
    )
  } else {
    const days = Math.floor(timeDifference / DAY_MILLISECOND)
    const hours = Math.floor(
      (timeDifference % DAY_MILLISECOND) / HOUR_MILLISECOND,
    )
    const minutes = Math.floor(
      (timeDifference % HOUR_MILLISECOND) / MINUTE_MILLISECOND,
    )

    const seconds = Math.floor(
      (timeDifference % MINUTE_MILLISECOND) / SECOND_MILLISECOND,
    )

    yield* put(
      lockDropActions.updateTimerSuccess({ days, hours, minutes, seconds }),
    )
  }
}
