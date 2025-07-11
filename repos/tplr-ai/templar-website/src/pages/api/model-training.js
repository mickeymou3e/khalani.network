import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/model-training
 * Returns model training loss metrics for the LossChart component
 * Query Parameters:
 * - timeRange (optional, default '24h'): One of 'latest', '1h', '24h', '1w', or a custom time range
 */
export const TIME_RANGE_OPTIONS = ['latest', '1h', '24h', '1w']
export const DEFAULT_TIME_RANGE = TIME_RANGE_OPTIONS[0]

export default async function handler(req, res) {
  const { range: timeRange, onlyLatestVersion } = getTimeRange(req.query.timeRange || DEFAULT_TIME_RANGE)
  const templar_version = await influxConfig.getVersion() // use parsed version from __init__.py if available
  const previous_templar_version = templar_version.replace(
    /(\d+)\.(\d+)\.(\d+)/,
    (_, major, minor, patch) => `${major}.${minor}.${Math.max(0, +patch - 1)}`
  )

  // dummy commit to trigger redeploy

  // Build version filter based on onlyLatestVersion flag
  // const versionFilter = onlyLatestVersion
  //   ? `r["version"] == "${templar_version}"`
  //   : `r["version"] == "${templar_version}" or r["version"] == "${previous_templar_version}"`
  const versionFilter = `r["version"] == "${templar_version}"`

  // Query to get loss data by step instead of time - using fixed range
  // const fluxQuery = `
  //   from(bucket: "${influxConfig.bucket}")
  //     |> range(start: 2025-04-01T00:00:00Z, stop: now())
  //     |> filter(fn: (r) => r._measurement == "Vvalidator_window_v2")
  //     |> filter(fn: (r) => r._field == "loss_random_before")
  //     |> filter(fn: (r) => r["uid"] == "1")
  //     |> filter(fn: (r) => contains(value: r["version"], set: [
  //         "0.2.73", "0.2.74", "0.2.75", "0.2.76", "0.2.77",
  //         "0.2.78", "0.2.79", "0.2.80", "0.2.81"
  //       ]))
  //     |> map(fn: (r) => ({ r with step_int: int(v: r.global_step) }))
  //     |> group(columns: ["step_int"])
  //     |> mean(column: "_value")
  //     |> sort(columns: ["step_int"], desc: false)
  //     |> map(fn: (r) => ({ step: r.step_int, loss: r._value }))
  // `
  const fluxQuery = `
    from(bucket: "${influxConfig.bucket}")
      |> range(start: 2025-04-01T00:00:00Z, stop: now())
      |> filter(fn: (r) => r._measurement == "Vvalidator_window_v2")
      |> filter(fn: (r) => r._field == "loss_random_before")
      |> filter(fn: (r) => r["uid"] == "1")
      |> filter(fn: (r) => ${versionFilter})
      |> map(fn: (r) => ({ r with step_int: int(v: r.global_step) }))
      |> group(columns: ["step_int"])
      |> mean(column: "_value")
      |> sort(columns: ["step_int"], desc: false)
      |> map(fn: (r) => ({ step: r.step_int, loss: r._value }))
  `

  console.log('Model training loss query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(
      fluxQuery,
      'model-training',
      { timeRange: req.query.timeRange || '24h' },
      { timeout: 2 * 60 * 1000 } // 2 minutes timeout
    )

    // Get the most recent loss value for display
    const getCurrentLoss = (data) => {
      if (data.length === 0) return 'N/A'

      // Sort by step descending to get the most recent value
      const sortedData = [...data].sort((a, b) => b.step - a.step)

      return parseFloat(sortedData[0].loss).toFixed(4)
    }

    // Format the results into a simple step/loss series
    const seriesData = results.map((point) => ({
      x: point.step,
      y: parseFloat(point.loss).toFixed(4),
    }))

    // Create response data structure matching LossChart component expectations
    const responseData = {
      value: getCurrentLoss(results),
      chart: {
        series: [{ name: 'Loss', data: seriesData }],
      },
    }

    // Set cache control headers - slightly shorter duration for chart data
    setCacheControlHeaders(res, CACHE_DURATIONS.STANDARD)

    // Add cache and timestamp information
    res.status(200).json({
      ...responseData,
      cached: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'model-training')
    res.status(500).json(errorResponse)
  }
}
