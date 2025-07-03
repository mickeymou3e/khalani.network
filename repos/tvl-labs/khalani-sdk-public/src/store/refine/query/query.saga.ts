import { StrictEffect, call, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { logger } from '@utils/logger'
import { queryRefineActions } from './query.slice'
import { queryRefinementRequest } from '@services/index'
import { QueryRefineParams, QueryRefineResult } from './query.types'

export function* queryRefineSaga(
  action: PayloadAction<QueryRefineParams>,
  customProxyUrl?: string,
): Generator<StrictEffect, void | QueryRefineResult> {
  try {
    const response = (yield call(
      queryRefinementRequest,
      action.payload,
      customProxyUrl,
    )) as QueryRefineResult

    yield put(queryRefineActions.requestSuccess(response))

    return response
  } catch (error) {
    yield put(queryRefineActions.requestError((error as Error).toString()))
    logger.error(error)
  }
}
