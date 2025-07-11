import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/miners
 * Returns miners data for the MinersTable component
 * Query Parameters:
 * - timeRange (optional, default '24h'): One of 'latest', '1h', '24h', '1w', or a custom time range
 */
export default async function handler(req, res) {
  const { range: timeRange, onlyLatestVersion } = getTimeRange(req.query.timeRange || '24h')
  const templar_version = await influxConfig.getVersion() // use parsed version from __init__.py if available

  const fluxQuery = `
    weight = from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Vvalidator_scores")
      |> filter(fn: (r) => r["_field"] == "weight")
      |> filter(fn: (r) => r["_value"] > 0)
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => r["version"] == "${templar_version}")
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> filter(fn: (r) => r["config_project"] == "templar")
      |> top(n:255, columns: ["_time"])
      |> group(columns: ["eval_uid"])
      |> first()

    binary_moving_avg = from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Vvalidator_scores")
      |> filter(fn: (r) => r["_field"] == "binary_moving_avg")
      |> filter(fn: (r) => r["_value"] > 0)
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => r["version"] == "${templar_version}")
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> filter(fn: (r) => r["config_project"] == "templar")
      |> top(n:255, columns: ["_time"])
      |> group(columns: ["eval_uid"])
      |> first()

    gradient_score = from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Vvalidator_scores")
      |> filter(fn: (r) => r["_field"] == "gradient_score")
      |> filter(fn: (r) => r["_value"] > 0)
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => r["version"] == "${templar_version}")
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> filter(fn: (r) => r["config_project"] == "templar")
      |> top(n:255, columns: ["_time"])
      |> group(columns: ["eval_uid"])
      |> first()

    union(tables: [weight, binary_moving_avg, gradient_score])
  `

  console.log('Miners data query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(
      fluxQuery,
      'miners',
      { timeRange: req.query.timeRange || '24h' },
      { timeout: 120000 } // 2 minutes timeout
    )

    // Process results by organizing data by miner (eval_uid)
    const minerData = {}

    results.forEach((row) => {
      const evalUid = row.eval_uid || 'unknown'
      if (!minerData[evalUid]) {
        minerData[evalUid] = {
          uid: evalUid,
          lastUpdated: new Date(row._time).toLocaleString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
        }
      }

      // Map InfluxDB fields to table fields
      switch (row._field) {
        case 'binary_moving_avg':
          // Format movingScore using scientific notation for very small values
          const movingValue = parseFloat(row._value)
          minerData[evalUid].movingScore = movingValue < 0.001 ? movingValue.toExponential(6) : movingValue.toFixed(6)
          break
        case 'gradient_score':
          minerData[evalUid].lossScore = parseFloat(row._value).toFixed(4)
          break
        case 'weight':
          minerData[evalUid].incentive = parseFloat(row._value).toFixed(4)
          break
      }
    })

    // Convert to array and add position
    const minersArray = Object.values(minerData)
      .filter((miner) => miner.lossScore && miner.movingScore) // Ensure we have the minimum required data
      .sort((a, b) => parseFloat(b.incentive) - parseFloat(a.incentive)) // Sort by incentive/weight (descending)
      .map((miner, index) => ({
        ...miner,
        pos: index + 1,
      }))

    // Set cache control headers to match our server-side caching strategy
    setCacheControlHeaders(res, CACHE_DURATIONS.STANDARD)

    // Return processed data
    res.status(200).json({
      miners: minersArray,
      cached: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'miners')
    res.status(500).json(errorResponse)
  }
}
