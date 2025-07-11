import { influxConfig } from '@/config/influxdb'
import { getTimeRange } from '@/helpers/getTimeRange'
import { CACHE_DURATIONS, setCacheControlHeaders } from '@/lib/httpUtils'
import { executeQuery, handleApiError } from '@/lib/influxRepository'

/**
 * GET /api/benchmarks
 * Returns benchmark scores from the templar_benchmark measurement
 * Query Parameters:
 * - timeRange (optional, default '1w'): One of 'latest', '1h', '24h', '1w', or a custom time range
 */
export default async function handler(req, res) {
  const { range: timeRange } = getTimeRange(req.query.timeRange || '1w')

  // Build version filter for benchmarks
  const templar_version = await influxConfig.getVersion()

  const fluxQuery = `
    from(bucket: "${influxConfig.bucket}")
      |> range(start: ${timeRange})
      |> filter(fn: (r) => r["_measurement"] == "Ebenchmark_metrics" or r["_measurement"] == "Ebenchmark_task")
      |> filter(fn: (r) => r["_field"] == "score")
      |> filter(fn: (r) => r["role"] == "evaluator")
      |> filter(fn: (r) => r["version"] == "${templar_version}")
      |> filter(fn: (r) => r["config_netuid"] == "3")
      |> group(columns: ["version", "uid", "_field", "task"])
      |> sort(columns: ["_time"], desc: true)
      |> first()
  `

  // dummy commit to force verce's redeployment
  // dummy commit to force verce's redeployment
  // dummy commit to force verce's redeployment
  // dummy commit to force verce's redeployment

  console.log('Benchmark scores query:', fluxQuery)

  try {
    // Execute query with caching
    const results = await executeQuery(fluxQuery, 'benchmarks', { timeRange: req.query.timeRange || '1w' }, { timeout: 60000 })

    // Define the specific tasks that we want to include
    const allowedTasks = ['arc_challenge', 'arc_easy', 'openbookqa', 'winogrande', 'piqa', 'hellaswag', 'mmlu']

    // Transform results into a more user-friendly format and filter to only include allowed tasks
    const formattedResults = results
      .filter((row) => allowedTasks.includes(row.task))
      .map((row) => ({
        task: row.task, // Task name like "arc_challenge", "arc_easy", etc.
        score: row._value, // The benchmark score
        global_step: row.global_step || 0, // Make sure global_step always exists
        window: row.window || 0,
        timestamp: row._time,
      }))

    // Ensure all allowed tasks are present in the results
    const tasksInResults = new Set(formattedResults.map((result) => result.task))
    const missingTasks = allowedTasks.filter((task) => !tasksInResults.has(task))

    // Add missing tasks with a score of 0
    const completedResults = [
      ...formattedResults,
      ...missingTasks.map((task) => ({
        task,
        score: 0,
        global_step: 0,
        window: 0,
        timestamp: new Date().toISOString(),
      })),
    ]

    // Benchmark data can be cached for longer periods
    setCacheControlHeaders(res, CACHE_DURATIONS.LONG)

    res.status(200).json({
      benchmarks: completedResults,
      cached: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorResponse = handleApiError(error, 'benchmarks')
    res.status(500).json(errorResponse)
  }
}
