import { LRUCache } from 'lru-cache'

const TTL = 60 * 60 * 1000 // Default TTL of 1 hour
const MAX_CACHE_SIZE = 10000 // Default max cache size
const ALLOW_STALE = true // Allow stale data

/**
 * API Cache implementation using LRU cache
 * - Uses stale-while-revalidate pattern
 * - Supports TTL (time-to-live)
 * - Handles background refresh
 */
class ApiCache {
  constructor(options = {}) {
    const defaultOptions = {
      max: MAX_CACHE_SIZE,
      ttl: TTL,
      allowStale: ALLOW_STALE,
    }

    this.cache = new LRUCache({
      ...defaultOptions,
      ...options,
    })

    this.refreshing = new Map()

    this.debug = options.debug || false
  }

  /**
   * Generate a cache key from the API endpoint and parameters
   * @param {string} apiName - Name of the API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} - Cache key
   */
  generateKey(apiName, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {})

    return `${apiName}:${JSON.stringify(sortedParams)}`
  }

  /**
   * Get data from cache or fetch it and cache the result
   * @param {string} cacheKey - Cache key
   * @param {Function} fetchFn - Function to fetch data if not in cache
   * @returns {Promise<any>} - Cached or freshly fetched data
   */
  async get(cacheKey, fetchFn) {
    try {
      const cachedValue = this.cache.get(cacheKey)

      if (cachedValue) {
        this.log(`Cache hit for key: ${cacheKey}`)

        if (!this.refreshing.has(cacheKey)) {
          this.log(`Potential stale data detected for key: ${cacheKey}, refreshing in background`)
          this.refreshInBackground(cacheKey, fetchFn)
        }

        return cachedValue
      }

      this.log(`Cache miss for key: ${cacheKey}`)
      return await this.fetchAndCache(cacheKey, fetchFn)
    } catch (error) {
      this.log(`Cache error for key: ${cacheKey}, fetching fresh data`, error)
      return await fetchFn()
    }
  }

  /**
   * Fetch data and store in cache
   * @param {string} cacheKey - Cache key
   * @param {Function} fetchFn - Function to fetch data
   * @returns {Promise<any>} - Fetched data
   */
  async fetchAndCache(cacheKey, fetchFn) {
    const data = await fetchFn()

    this.cache.set(cacheKey, data)

    return data
  }

  /**
   * Refresh cache in background without blocking
   * @param {string} cacheKey - Cache key
   * @param {Function} fetchFn - Function to fetch data
   */
  refreshInBackground(cacheKey, fetchFn) {
    this.refreshing.set(cacheKey, true)

    // Execute refresh in background
    ;(async () => {
      try {
        const freshData = await fetchFn()
        this.cache.set(cacheKey, freshData)
        this.log(`Background refresh completed for key: ${cacheKey}`)
      } catch (error) {
        this.log(`Background refresh failed for key: ${cacheKey}`, error)
      } finally {
        this.refreshing.delete(cacheKey)
      }
    })()
  }

  /**
   * Explicitly invalidate a cache entry
   * @param {string} cacheKey - Cache key
   */
  invalidate(cacheKey) {
    this.cache.delete(cacheKey)
    this.log(`Cache invalidated for key: ${cacheKey}`)
  }

  /**
   * Log messages when debug mode is enabled
   * @param {string} message - Message to log
   * @param {Error} [error] - Optional error
   */
  log(message, error) {
    if (this.debug) {
      console.log(`[ApiCache] ${message}`)
      if (error) {
        console.error(error)
      }
    }
  }
}

const apiCache = new ApiCache({
  max: MAX_CACHE_SIZE,
  ttl: TTL,
  allowStale: ALLOW_STALE,
  debug: process.env.NODE_ENV !== 'production',
})

export default apiCache
