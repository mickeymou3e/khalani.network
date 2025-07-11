import { useEffect, useState } from 'react'

export const useApi = (url) => {
  const [data, setData] = useState({ loading: true })

  useEffect(() => {
    // Reset loading state when URL changes
    setData({ loading: true })

    async function doFetch() {
      try {
        const result = await fetch(url)
        if (!ignore) {
          const jsonData = await result.json()
          setData({ ...jsonData, loading: false })
        }
      } catch (error) {
        if (!ignore) {
          console.error(`Error fetching ${url}:`, error)
          setData({ error: error.message, loading: false })
        }
      }
    }

    let ignore = false
    doFetch()
    return () => {
      ignore = true
    }
  }, [url])

  return data
}
