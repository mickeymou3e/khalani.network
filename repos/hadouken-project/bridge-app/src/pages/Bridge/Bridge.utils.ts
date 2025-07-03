import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { AccountBoundToken, Network } from 'nervos-bridge'

import { TokenModelBalance } from '@hadouken-project/ui/dist/interfaces/core'

export const removeDirectionFromSymbol = (
  token: AccountBoundToken,
): AccountBoundToken => {
  return {
    ...token,
    symbol: token.symbol.replace(/(["|"])\w+/g, ''),
  }
}

export const mapBridgeTokenNames = (
  token: AccountBoundToken,
): TokenModelBalance => {
  switch (token.network as Network) {
    case Network.CKB:
      return {
        ...token,
        id: token?.address,
        name: `${token.symbol} | ckb`,
        displayName: token?.symbol,
        source: '',
      }

    case Network.Godwoken:
      return {
        ...token,
        id: token?.address,
        name: `${token.symbol} | gw`,
        displayName: token?.symbol,
        source: '',
      }
    case Network.Ethereum:
      return {
        ...token,
        id: token?.address,
        name: `${token.symbol} | eth`,
        displayName: token?.symbol,
        source: 'eth',
      }
    case Network.BSC:
      return {
        ...token,
        id: token?.address,
        name: `${token.symbol} | bsc`,
        displayName: token?.symbol,
        source: 'bsc',
      }
    default:
      return {
        ...token,
        id: token?.address,
        name: `${token.symbol} | eth`,
        displayName: token?.symbol,
        source: 'eth',
      }
  }
}

export const useQuery = (): URLSearchParams => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
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

export const useCurrentPath = (): string => {
  const history = useHistory()

  const [pathName, setPathName] = useState(history?.location?.pathname)

  useEffect(() => {
    return history?.listen((location) => {
      setPathName(location.pathname)
    })
  }, [history])

  return pathName
}
