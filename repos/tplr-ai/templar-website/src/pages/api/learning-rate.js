import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/learning-rate
 * Returns the current learning rate from the validator metrics
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
  const versionFilter = onlyLatestVersion
    ? `r["version"] == "${templar_version}"`
    : `r["version"] == "${templar_version}" or r["version"] == "${previous_templar_version}"`

  // Query to get current learning rate
  const fluxQuery = `
    from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Vvalidator_window_v2")
      |> filter(fn: (r) => r["_field"] == "learning_rate")
      |> filter(fn: (r) => r["_value"] > 0)
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => ${versionFilter})
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> filter(fn: (r) => r["config_project"] == "templar")
      |> group(columns: ["uid", "_field"])
      |> sort(columns: ["_time"], desc: true)
      |> first()
  `

  console.log('Learning rate query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(fluxQuery, 'learning-rate', { timeRange: req.query.timeRange || '24h' }, { timeout: 60000 })

    // Process result to get the learning rate value
    let value = null
    let timestamp = null

    if (results.length > 0) {
      // Parse the value as a float with scientific notation formatting for small values
      const learningRate = parseFloat(results[0]._value)
      value = learningRate < 0.001 ? learningRate.toExponential(4) : learningRate.toFixed(4)
      timestamp = results[0]._time
    }

    // Set cache control headers - medium cache duration
    setCacheControlHeaders(res, CACHE_DURATIONS.MEDIUM)

    res.status(200).json({
      value: value,
      timestamp: timestamp,
      cached: true,
      responseTime: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'learning-rate')
    res.status(500).json(errorResponse)
  }
}
