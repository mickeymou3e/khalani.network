import clsx from 'clsx'
import Lottie from '@/components/motion/Lottie'

import useUIStore from '@/store/ui'

import DataBlock from './DataBlock'

import s from './DataBlocks.module.scss'

const DataBlocks = ({ data }) => {
  const theme = useUIStore((s) => s.theme)

  return (
    <section className={clsx(s.dataBlocksSection, s[theme])}>
      <ul className={s.dataBlocks}>
        {data.map((block, i) => (
          <DataBlock key={i} {...block} />
        ))}
      </ul>
      <aside className={s.aside}>
        <Lottie allowPlay className={s.lottie} url="/lottie/Bittensor_Panel.json" forceLoad loop aspectRatio={662 / 1062} />
      </aside>
    </section>
  )
}

export default DataBlocks
