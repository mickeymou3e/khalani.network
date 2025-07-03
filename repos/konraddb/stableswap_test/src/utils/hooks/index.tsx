import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import _ from 'lodash'

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

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function deepCompareEquals(a: any, b: any) {
  return _.isEqual(a, b)
}

function useDeepCompareMemoize(value: any) {
  const ref = useRef()
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(
  callback: () => void,
  dependencies: any[],
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize))
}
