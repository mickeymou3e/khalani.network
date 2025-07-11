import { influxConfig } from '@/config/influxdb'
import { InfluxDB } from '@influxdata/influxdb-client'
import apiCache from './apiCache'

// Constants specific to InfluxDB operations
const QUERY_TIMEOUTS = {
  DEFAULT: 60000,
  LONG: 120000,
}

/**
 * Creates a configured InfluxDB client
 * @param {number} [timeout=QUERY_TIMEOUTS.DEFAULT] - Query timeout in milliseconds
 * @returns {Object} InfluxDB client
 */
export function createInfluxClient(timeout = QUERY_TIMEOUTS.DEFAULT) {
  return new InfluxDB({
    url: influxConfig.url,
    token: influxConfig.token,
    timeout: timeout,
  })
}

/**
 * Execute a Flux query with caching
 * @param {string} fluxQuery - The Flux query to execute
 * @param {string} apiName - The name of the API endpoint (used for cache key)
 * @param {Object} params - Query parameters (used for cache key)
 * @param {Object} options - Additional options
 * @returns {Promise<Array>} - Query results
 */
export async function executeQuery(fluxQuery, apiName, params = {}, options = {}) {
  const cacheKey = apiCache.generateKey(apiName, params)

  const fetchFunction = async () => {
    const influxDB = createInfluxClient(options.timeout)
    const queryApi = influxDB.getQueryApi(influxConfig.org)

    const results = []

    return new Promise((resolve, reject) => {
      const startTime = Date.now()

      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          results.push(tableMeta.toObject(row))
        },
        error(err) {
          console.error(`Error in ${apiName} query:`, err)
          reject(err)
        },
        complete() {
          const duration = Date.now() - startTime
          if (options.debug) {
            console.log(`Query for ${apiName} completed in ${duration}ms`)
          }
          resolve(results)
        },
      })
    })
  }

  return await apiCache.get(cacheKey, fetchFunction)
}

/**
 * Transforms query results into a standard format for the API
 * @param {Array} results - Query results
 * @param {Function} transformFn - Function to transform query results
 * @returns {Object} - Standard API response
 */
export function transformResults(results, transformFn) {
  try {
    const transformedData = transformFn ? transformFn(results) : results

    return {
      data: transformedData,
      timestamp: new Date().toISOString(),
      cached: true,
    }
  } catch (error) {
    console.error('Error transforming results:', error)
    throw error
  }
}

/**
 * Handle API errors in a consistent way
 * @param {Error} error - The error that occurred
 * @param {string} apiName - The name of the API endpoint
 * @returns {Object} - Standard error response
 */
export function handleApiError(error, apiName) {
  console.error(`Error in ${apiName}:`, error)

  return {
    error: 'Internal server error',
    message: error.message || 'An unknown error occurred',
    timestamp: new Date().toISOString(),
  }
}
