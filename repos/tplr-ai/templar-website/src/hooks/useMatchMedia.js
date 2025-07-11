import { useState, useEffect } from 'react'

function match(mediaQuery = '') {
  if (typeof window !== 'undefined') {
    return window.matchMedia(mediaQuery).matches
  }
  return null
}

// Only use { immediate: true } if you know it won't cause a hydration error
const useMatchMedia = (mediaQuery = '', { immediate = false } = {}) => {
  const [isMatching, setIsMatching] = useState(
    immediate ? match(mediaQuery) : null,
  )

  useEffect(() => {
    const getMatchMedia = () => {
      const mq = window.matchMedia(mediaQuery)
      setIsMatching(mq.matches)
    }

    getMatchMedia()

    window.addEventListener('resize', getMatchMedia)
    return () => window.removeEventListener('resize', getMatchMedia)
  }, [mediaQuery])

  return isMatching
}

export default useMatchMedia
