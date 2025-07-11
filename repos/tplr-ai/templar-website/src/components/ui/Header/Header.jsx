import { useState, useMemo, useEffect, Fragment } from 'react'
import { AnimatePresence } from 'motion/react'
import Link from 'next/link'
import clsx from 'clsx'

import useUIStore from '@/store/ui'

import { SiteHeadline } from '@/components/ui/Text'
import CharAnimation from '@/components/motion/CharAnimation'

import Wordmark from '@/assets/svg/wordmark.svg'

import s from './Header.module.scss'

function Header({ lines = [], pageTheme }) {
  const [currentLine, setCurrentLine] = useState(0)
  const theme = useUIStore((s) => s.theme)
  const componentTheme = pageTheme || theme

  const animations = useMemo(() => {
    return lines.map((line, index) => {
      return <CharAnimation key={index}>{line}</CharAnimation>
    })
  }, [lines])

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLine((prev) => (prev + 1) % lines.length)
    }, 4000)
    return () => clearTimeout(timer)
  }, [currentLine, lines.length])

  return (
    <header className={clsx(s.header, s[componentTheme])}>
      <AnimatePresence>
        <SiteHeadline className={s.headline} key={currentLine}>
          <span className={s.wordmark}>
            <Link href="/">
              <Wordmark /> <em key="wordmarkName">TEMPLAR&nbsp;</em>
            </Link>
          </span>
          <Fragment>{animations[currentLine]}</Fragment>
        </SiteHeadline>
      </AnimatePresence>
    </header>
  )
}

export default Header
