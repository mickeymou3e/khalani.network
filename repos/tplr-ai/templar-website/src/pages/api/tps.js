import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/tps
 * Returns tokens per second metrics
 * Query Parameters:
 * - timeRange (optional, default '24h'): One of 'latest', '1h', '24h', '1w', or a custom time range
 * - aggregate (optional): if 'true', returns aggregated mean across all series, versions, and uids
 * - uid (optional): Filter results by a specific uid
 */
export default async function handler(req, res) {
  const { uid, aggregate } = req.query
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

  let fluxQuery = ''

  // Simplified query for aggregate mode with project and netuid filters
  if (aggregate === 'true') {
    fluxQuery = `
      from(bucket: "${influxConfig.bucket}")
        |> range(start: ${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "Mtraining_step_v2")
        |> filter(fn: (r) => r["_field"] == "tokens_per_sec")
        |> filter(fn: (r) => r["_value"] > 0)
        |> filter(fn: (r) => r["config_netuid"] == "3")
        |> filter(fn: (r) => r["config_project"] == "templar")
        |> group()
        |> mean()
    `
  } else if (uid) {
    // Filter by uid
    fluxQuery = `
      from(bucket: "${influxConfig.bucket}")
        |> range(start: ${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "Mtraining_step_v2")
        |> filter(fn: (r) => r["_field"] == "tokens_per_sec")
        |> filter(fn: (r) => r["_value"] > 0)
        |> filter(fn: (r) => r["uid"] == "${uid}")
        |> filter(fn: (r) => ${versionFilter})
        |> filter(fn: (r) => r["config_netuid"] == "3")
        |> filter(fn: (r) => r["config_project"] == "templar")
        |> sort(columns: ["_time"], desc: true)
        |> first()
    `
  } else {
    // Default query for all data
    fluxQuery = `
      from(bucket: "${influxConfig.bucket}")
        |> range(start: ${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "Mtraining_step_v2")
        |> filter(fn: (r) => r["_field"] == "tokens_per_sec")
        |> filter(fn: (r) => r["_value"] > 0)
        |> filter(fn: (r) => ${versionFilter})
        |> filter(fn: (r) => r["config_netuid"] == "3")
        |> filter(fn: (r) => r["config_project"] == "templar")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 50)
    `
  }

  console.log('Tokens-per-sec query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(
      fluxQuery,
      'tps',
      {
        timeRange: req.query.timeRange || '24h',
        aggregate: req.query.aggregate,
        uid: req.query.uid,
      },
      { timeout: 60000 }
    )

    // If no results and aggregate mode, use default value
    const finalResults = results.length === 0 && aggregate === 'true' ? [{ _value: 0 }] : results

    // TPS data can be cached for a shorter period as it changes more frequently
    setCacheControlHeaders(res, CACHE_DURATIONS.STANDARD)

    res.status(200).json({
      data: finalResults,
      cached: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'tps')
    res.status(500).json(errorResponse)
  }
}
