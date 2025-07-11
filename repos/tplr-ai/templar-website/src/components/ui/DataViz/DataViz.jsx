import { useState } from 'react'
import clsx from 'clsx'

import useBreakpoint from '@/hooks/useBreakpoint'
import ResponsiveVideoLoop from '@/components/core/ResponsiveVideoLoop'
// import Lottie from '@/components/motion/Lottie'

import s from './DataViz.module.scss'

function DataViz() {
  const isDesktop = useBreakpoint('desktop')
  const [canPlay, setCanPlay] = useState(false)
  return (
    <div className={clsx(s.dataViz, canPlay && s.canPlay)}>
      <ResponsiveVideoLoop
        smallSrc="/videos/Bittensor_Mobile.mp4#t=0.001"
        largeSrc="/videos/Bittensor_Desktop.mp4#t=0.001"
        smallClassName={s.mobile}
        largeClassName={s.desktop}
        showLargeVideo={isDesktop}
        onCanPlay={() => {
          setCanPlay(true)
        }}
      />

      {/* {isDesktop === true && (
        <Lottie allowPlay={canPlay} className={s.lottie} url="/lottie/CornerGraph.json" forceLoad loop aspectRatio={480 / 483} />
      )} */}
    </div>
  )
}

export default DataViz
