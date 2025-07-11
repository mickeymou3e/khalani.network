import { useState, useEffect } from 'react'

const TaskComparison = () => {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWandBData = async () => {
      const apiKey = '741fcf864a1e4a5cee75de1daa2d22221cbd57f5'
      const entity = 'tplr'
      const project = 'templar-v0.1.100000'
      const runId = 'c0zbavt7'
      const url = `https://api.wandb.ai/v1/${entity}/${project}/runs/${runId}`

      // curl -H "Authorization: Bearer 741fcf864a1e4a5cee75de1daa2d22221cbd57f5" "https://api.wandb.ai/v1/tplr/templar-v0.1.100001/runs"

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`)
        }

        const data = await response.json()
        setRuns(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWandBData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Weights & Biases Runs</h1>
      <ul>
        {runs.map((run, index) => (
          <li key={run.id || index}>
            <p>
              <strong>Name:</strong> {run.name}
            </p>
            <p>
              <strong>ID:</strong> {run.id}
            </p>
            <p>
              <strong>Metrics:</strong> {JSON.stringify(run.metrics || {})}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskComparison
