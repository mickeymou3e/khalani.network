import clsx from 'clsx'
import Lottie from '@/components/motion/Lottie'

import { BodyCopy, MediumTitle, TechDetails } from '@/components/ui/Text'

import s from './DataBlocks.module.scss'

const DataBlock = ({ type, lottieUrl, visualComponent, className, ...props }) => {
  const isHero = type === 'hero'

  const Title = isHero ? TechDetails : BodyCopy

  return (
    <li className={clsx(s.dataBlock, s[type], className)}>
      <Title as="h2" className={s.title}>
        {props.title}
        {props.subtitle && <span className={s.subtitle}>{props.subtitle}</span>}
      </Title>
      {isHero ? (
        <div className={s.valueRow}>
          <MediumTitle>{props.value}</MediumTitle>
          {lottieUrl && <Lottie allowPlay className={s.lottie} url={lottieUrl} forceLoad loop aspectRatio={75 / 46} />}
          {visualComponent}
        </div>
      ) : (
        <ul>
          {props.data.map((item, i) => (
            <li key={i} className={s.dataItem}>
              <TechDetails>{item.label}</TechDetails>
              <TechDetails>{item.value}</TechDetails>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

export default DataBlock
