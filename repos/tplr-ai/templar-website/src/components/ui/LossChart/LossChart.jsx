import clsx from 'clsx'
import dynamic from 'next/dynamic'

import useUIStore from '@/store/ui'

import DataBlock from '@/components/ui/DataBlocks/DataBlock'
import { BigTitle, MediumTitle, TechDetails } from '@/components/ui/Text'

import s from './LossChart.module.scss'

const CandlestickChart = dynamic(() => import('./CandlestickChart'), {
  loading: () => (
    <div className={s.loading}>
      <div className={s.spinner}></div>
      <MediumTitle className={s.loadingText}>Loading Step-based Loss Function Analyzer</MediumTitle>
      <TechDetails>Calculating across the subnet... please stand by</TechDetails>
    </div>
  ),
  ssr: false,
})

const LossChart = ({ data, blockTitle, blockValue, blockLottieUrl }) => {
  const theme = useUIStore((s) => s.theme)
  const isLoading = !data || data.loading

  return (
    <section className={clsx(s.lossChartSection, s[theme])}>
      <div className={s.intro}>
        <div className={s.themeSwitcher}>
          <button
            className={clsx(s.themeSwitcherButton, theme === 'light' && s.active)}
            onClick={() => useUIStore.setState({ theme: 'light' })}
          >
            <TechDetails className={s.switcherLabel}>Light</TechDetails>
          </button>
          <button
            className={clsx(s.themeSwitcherButton, theme === 'dark' && s.active)}
            onClick={() => useUIStore.setState({ theme: 'dark' })}
          >
            <TechDetails className={s.switcherLabel}>Dark</TechDetails>
          </button>
        </div>
        <BigTitle>Model Training</BigTitle>
        <DataBlock className={s.card} type="hero" value={blockValue} title={blockTitle} lottieUrl={blockLottieUrl} />
      </div>
      <div className={s.chart}>
        {isLoading ? (
          <div className={s.loading}>
            <div className={s.spinner}></div>
            <MediumTitle className={s.loadingText}>Loading Step-based Loss Function Analyzer</MediumTitle>
            <TechDetails>Calculating across the subnet... please stand by</TechDetails>
          </div>
        ) : (
          <CandlestickChart data={data} theme={theme} />
        )}
      </div>
    </section>
  )
}

export default LossChart
