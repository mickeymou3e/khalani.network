import { useState, useRef, useEffect, Fragment } from 'react'
import { AnimatePresence } from 'motion/react'
import clsx from 'clsx'

import IconOpen from '@/assets/svg/btn-open.svg'
import IconClose from '@/assets/svg/btn-close.svg'

import CharAnimation from '@/components/motion/CharAnimation'
import { TechDetails } from '@/components/ui/Text'

import s from './GetStartedCTA.module.scss'

const strCommand = '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/RaoFoundation/templar/main/scripts/run.sh'

function GetStartedCTA({ href }) {
  const [mounted, setMounted] = useState(false)
  const hasAnimated = useRef(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onTransitionEnd = () => {
    console.log('animation end')
    hasAnimated.current = true
    !isHovered && setIsActive(false)
  }

  const onPointerEnter = () => {
    if (isActive) return
    hasAnimated.current = false
    setIsHovered(true)
    setIsActive(true)
  }

  const onPointerLeave = () => {
    setIsHovered(false)
    console.log('pointer leave', hasAnimated.current)
    hasAnimated.current && setIsActive(false)
  }

  return (
    <div className={clsx(s.container)}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={s.ctaLabel}>
          <AnimatePresence>
            <TechDetails className={s.ctas} key={isHovered ? 'hovered' : 'default'}>
              <CharAnimation delay={mounted ? 0 : 2}>Get Started</CharAnimation>
            </TechDetails>
          </AnimatePresence>
        </div>
        <div className={clsx(s.box, isActive && s.isAnimating)}>
          <div className={clsx(s.boxBtns, s.btnOpen)}>
            <IconOpen className={clsx(s.btn)} />
            <IconOpen className={clsx(s.btn)} />
          </div>
        </div>
      </a>
    </div>
  )
}

export default GetStartedCTA
