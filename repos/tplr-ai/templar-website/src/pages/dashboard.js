import DataBlocks from '@/components/ui/DataBlocks'
import Header from '@/components/ui/Header'
import LossChart from '@/components/ui/LossChart'
import LossIcon from '@/components/ui/LossChart/LossIcon'
import MinersTable from '@/components/ui/MinersTable'
import { useEffect, useState } from 'react'

import Footer from '@/components/ui/Footer'

import { influxConfig } from '@/config/influxdb'
import { useApi } from '@/hooks/useApi'

const Dashboard = () => {
  const learningRate = useApi('/api/learning-rate')
  const gammaPrice = useApi('/api/price')
  const benchmarks = useApi('/api/benchmarks')
  const evaluatedMiners = useApi('/api/evaluated-miners')
  const miners = useApi('/api/miners')
  const lossChartData = useApi('/api/model-training')

  const [version, setVersion] = useState('0.0.0')
  useEffect(() => {
    const getVersion = async () => {
      const version = await influxConfig.getVersion()
      setVersion(version)
    }
    getVersion()
  }, [])

  return (
    <main>
      <Header lines={[]} />

      <LossChart
        data={lossChartData}
        blockTitle="Gamma Price"
        blockValue={`τ${(gammaPrice?.price || '').toLocaleString()}`}
        blockLottieUrl="/lottie/Bittensor_GammaPrice.json"
      />
      <DataBlocks
        data={[
          {
            type: 'hero',
            title: '',
            subtitle: '',
            value: '',
            title: 'Loss ',
            subtitle: `V.${version}`,
            value: parseFloat(lossChartData?.value || 0).toFixed(4),
            // lottieUrl: '/lottie/Bittensor_GammaPrice.json',
            visualComponent: <LossIcon />,
          },
          {
            type: 'hero',
            title: 'Learning Rate',
            value: learningRate?.value || '0',
            lottieUrl: '/lottie/Bittensor_TokensPerSecond.json',
          },
          {
            type: 'hero',
            title: 'Evaluated Miners',
            value: evaluatedMiners?.count?.toString() || '0',
            lottieUrl: '/lottie/Bittensor_Bandwidth.json',
          },
          ...(benchmarks?.benchmarks?.map((benchmark) => ({
            type: 'table',
            title: benchmark.task,
            data: [
              { label: 'Performance', value: benchmark.score.toFixed(4) },
              { label: 'Step', value: benchmark.global_step },
            ],
          })) || []),
        ]}
      />
      <MinersTable data={miners?.miners || []} dataKeys={['pos', 'uid', 'movingScore', 'lossScore', 'incentive', 'lastUpdated']} />
      <Footer />
    </main>
  )
}

export default Dashboard
