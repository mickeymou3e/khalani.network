import clsx from 'clsx'
import { easeExpOut } from 'd3-ease'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useState } from 'react'

import Wordmark from '@/assets/svg/wordmark.svg'

import useBreakpoint from '@/hooks/useBreakpoint'

import { BodyCopy } from '@/components/ui/Text'

import BtnOpen from '@/assets/svg/btn-open.svg'
import MenuClose from '@/assets/svg/menu-close.svg'
import MenuOpen from '@/assets/svg/menu-open.svg'

import SocialIcons from '@/components/ui/SocialIcons/SocialIcons'

import useUIStore from '@/store/ui'

import s from './Navigation.module.scss'

const links = [
  { label: 'Home', data: { href: '/' } },
  {
    label: 'Dashboard',
    data: { href: '/dashboard' },
  },
  {
    label: 'Research',
    data: { href: '/research' },
  },
  {
    label: 'Docs',
    data: { href: 'https://docs.tplr.ai', target: '_blank', rel: 'noopener noreferrer' },
    isExternal: true,
  },
  {
    label: 'Careers',
    data: { href: '/careers' },
  },
]

function Navigation({ pageTheme }) {
  const [isOpen, setIsOpen] = useState(false)
  const isDesktop = useBreakpoint('medium')
  const isActive = isOpen || isDesktop
  const theme = useUIStore((s) => s.theme)

  return (
    <nav className={clsx(s.navigationWrapper, s[pageTheme || theme], isActive && s.isActive)}>
      <button className={s.menuButton} onClick={() => setIsOpen((s) => !s)}>
        <MenuOpen className={s.menuOpen} />
        <MenuClose className={s.menuClose} />
      </button>
      <motion.div
        className={s.navigationInner}
        initial={{ y: '-100%' }}
        animate={{ y: isActive ? 0 : '-100%' }}
        transition={{ duration: 1, ease: easeExpOut }}
      >
        <header className={s.navigationHeader}>
          <Wordmark className={s.logo} />
        </header>
        <div className={s.desktopNavLayout}>
          <ul className={s.navigation}>
            {links.map(({ label, data, isExternal }, i) => (
              <motion.li
                key={label}
                className={s.linkWrapper}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  transition: { delay: isActive ? 0.1 * i + 0.2 : 0, duration: isActive ? 0.35 + i * 0.2 : 0.2 },
                }}
              >
                <Link className={clsx(s.link, isExternal && s.external)} {...data} onClick={() => setIsOpen(false)}>
                  <BodyCopy className={s.linkLabel} as="span">
                    {label}
                    {isExternal && <BtnOpen />}
                  </BodyCopy>
                </Link>
              </motion.li>
            ))}
          </ul>
          <motion.div 
            className={s.socialIconsInNav}
            initial={{ opacity: 0 }}
            animate={{
              opacity: isActive ? 1 : 0,
              transition: { delay: isActive ? 0.1 * links.length + 0.2 : 0, duration: isActive ? 0.35 + links.length * 0.2 : 0.2 }
            }}
          >
            <SocialIcons />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className={s.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 0.1 : 0 }}
        transition={{
          duration: 0.75,
        }}
      />
    </nav>
  )
}

export default Navigation
