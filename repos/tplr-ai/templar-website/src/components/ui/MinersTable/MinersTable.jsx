import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import clsx from 'clsx'
import { easeQuadInOut } from 'd3-ease'

import useUIStore from '@/store/ui'

import { BigTitle, BodyCopy, TechDetails } from '@/components/ui/Text'

import MinersTableVisual from '@/assets/svg/MinersTableVisual.svg'
import MinersTableArrow from '@/assets/svg/MinersTableArrow.svg'

import s from './MinersTable.module.scss'

const Arrow = ({ invert }) => {
  return (
    <span className={clsx(s.arrow, invert && s.invert)}>
      <MinersTableArrow />
    </span>
  )
}

const camelToTitle = (camelCase) => {
  const result = camelCase.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

const MinersTable = ({ data, dataKeys }) => {
  const theme = useUIStore((s) => s.theme)
  const [sortConfig, setSortConfig] = useState({ key: 'incentive', direction: 'descending' })

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const tBodyRef = useRef()
  const isTableInView = useInView(tBodyRef, { once: true, amount: 0 })

  return (
    <section className={clsx(s.minersTable, s[theme])}>
      <div className={s.intro}>
        <BigTitle className={s.title}>Miners Incentive</BigTitle>
        <div className={s.visual}>
          <MinersTableVisual />
          <div className={s.status}>
            <TechDetails className={s.statusLabel}>Status:</TechDetails>
            <TechDetails className={s.statusValue}>Live</TechDetails>
          </div>
        </div>
      </div>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead className={s.head}>
            <tr>
              {dataKeys.map((key) => {
                const isActive = sortConfig.key === key

                return (
                  <th key={key} onClick={() => requestSort(key)} className={clsx(isActive && s.active)}>
                    <TechDetails className={s.headLabel}>
                      {camelToTitle(key)}
                      {isActive && <Arrow invert={sortConfig.direction === 'ascending'} />}
                    </TechDetails>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody ref={tBodyRef} className={s.body}>
            <AnimatePresence mode="sync">
              {sortedData.map((item, i) => (
                <motion.tr
                  key={item.uid + sortConfig.key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isTableInView ? 1 : 0, transition: { duration: 0.5, delay: i * 0.05, ease: easeQuadInOut } }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                >
                  {dataKeys.map((key) => (
                    <BodyCopy as="td" key={key}>
                      {item[key]}
                    </BodyCopy>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default MinersTable
