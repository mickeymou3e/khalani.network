import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/evaluated-miners
 * Returns the count of evaluated miners from the validator metrics
 * Query Parameters:
 * - timeRange (optional, default '24h'): One of 'latest', '1h', '24h', '1w', or a custom time range
 */
export default async function handler(req, res) {
  const { range: timeRange, onlyLatestVersion } = getTimeRange(req.query.timeRange || '24h')

  // Get version info for filters
  const templar_version = await influxConfig.getVersion()
  const previous_templar_version = templar_version.replace(
    /(\d+)\.(\d+)\.(\d+)/,
    (_, major, minor, patch) => `${major}.${minor}.${Math.max(0, +patch - 1)}`
  )

  // Build version filter
  const versionFilter = `r["version"] == "${templar_version}"`

  // Query to get evaluated miners count
  const fluxQuery = `
    from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Vvalidator_window_v2")
      |> filter(fn: (r) => r["_field"] == "evaluated_uids_count")
      |> filter(fn: (r) => r["_value"] > 0)
      |> filter(fn: (r) => r["role"] == "validator")
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => ${versionFilter})
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> group(columns: ["version", "uid", "_field"])
      |> sort(columns: ["_time"], desc: true)
      |> first()
  `

  console.log('Evaluated miners query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(fluxQuery, 'evaluated-miners', { timeRange: req.query.timeRange || '24h' }, { timeout: 60000 })

    // Process results to get the count
    let count = 0

    if (results.length > 0) {
      count = parseInt(results[0]._value) || 0
    }

    // Use standard cache duration for evaluated miners count
    setCacheControlHeaders(res, CACHE_DURATIONS.SHORT)

    res.status(200).json({
      count: count,
      cached: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'evaluated-miners')
    res.status(500).json(errorResponse)
  }
}
