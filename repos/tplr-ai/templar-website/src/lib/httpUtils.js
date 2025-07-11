/**
 * HTTP Utilities for API responses
 */

// Cache durations in seconds
export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 5 * 60, // 5 minutes
  STANDARD: 30 * 60, // 30 minutes (matches our server-side LRU cache)
  LONG: 60 * 60, // 1 hour
}

/**
 * Set cache control headers for API responses
 * @param {Object} res - Next.js/Express response object
 * @param {number} maxAge - Max age in seconds
 * @param {boolean} isPublic - Whether cache is public or private
 * @param {boolean} mustRevalidate - Whether stale-while-revalidate is enabled
 */
export function setCacheControlHeaders(res, maxAge = CACHE_DURATIONS.STANDARD, isPublic = true, mustRevalidate = true) {
  const directive = [isPublic ? 'public' : 'private', `max-age=${maxAge}`]

  if (mustRevalidate) {
    // Allow use of stale response while revalidating in background
    directive.push(`stale-while-revalidate=${Math.floor(maxAge / 2)}`)
  }

  res.setHeader('Cache-Control', directive.join(', '))

  res.setHeader('Vary', 'Accept, Accept-Encoding')

  res.setHeader('Accept-CH', 'DPR, Viewport-Width, Width')
}
