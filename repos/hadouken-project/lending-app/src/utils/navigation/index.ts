import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

interface CustomState {
  internalNavigation: boolean
}

export const usePushHistoryInternal = (): ((
  path: string,
  search?: string,
) => void) => {
  const history = useHistory()
  const pushHistory = useCallback(
    (path: string, search?: string) =>
      history.push({
        pathname: path,
        state: { internalNavigation: true },
        search: search,
      }),
    [history],
  )

  return pushHistory
}

export const useGoBack = (): (() => void) => {
  const history = useHistory()
  const state = history.location.state as CustomState
  const goBack = useCallback(
    () =>
      state?.internalNavigation
        ? history.goBack()
        : history.push({
            pathname: '/',
            state: { internalNavigation: true },
          }),
    [history],
  )
  return goBack
}
