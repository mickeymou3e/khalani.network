import React from 'react'
import { easeExpOut } from 'd3-ease'
import { motion } from 'motion/react'
import clsx from 'clsx'

import s from './CharAnimation.module.scss'

const variantsWithFilter = {
  initial: {
    opacity: 0,
    // filter: "blur(4px) brightness(0.85)",
  },
  animate: ({ i, delay = 0.5 }) => ({
    opacity: 1,
    // filter: "blur(0px) brightness(1)",
    transition: {
      duration: 1 + Math.pow(i * 0.01, 2),
      // delay: 0.5 + i * 0.02,
      delay: delay + Math.random() * 0.5,
      easing: easeExpOut,
    },
  }),
  exit: ({ i }) => ({
    opacity: 0,
    // filter: "blur(4px) brightness(0.85)",
    transition: {
      // duration: 0.5 + Math.pow(i * 0.025, 2),
      duration: 0.3 + Math.pow(i * 0.01, 2),
      // delay: Math.pow(i * 0.01, 2),
      delay: Math.random() * 0.2,
      easing: easeExpOut,
    },
  }),
}

const motionWrap = (text, i, { charClassName, spaceClassName, delay } = {}) => {
  const parts = text.split(/(<br\/>)/)
  return parts.map((part, partIndex) => {
    if (part === '<br/>') {
      return <br key={`br-${partIndex}`} />
    }
    return part.split('').map((char, charIndex) => {
      i.current += 1
      return (
        <motion.span
          key={`${charIndex}-${i.current}`}
          className={clsx(s.char, charClassName, char === ' ' && s.space, char === ' ' && spaceClassName)}
          variants={variantsWithFilter}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={{ i: i.current, delay }}
        >
          {char}
        </motion.span>
      )
    })
  })
}

const charsWrap = (node, i, opts) => {
  if (typeof node === 'string') {
    return motionWrap(node, i, opts)
  } else if (React.isValidElement(node)) {
    if (node.type === 'em') {
      return <em>{motionWrap(node.props.children.toString(), i, opts)}</em>
    } else if (node.type === 'img') {
      i.current += 1
      return (
        <motion.span
          className={clsx(s.img)}
          variants={variantsWithFilter}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={{ i: i.current, delay: opts.delay }}
        >
          {node}
        </motion.span>
      )
    }
    return node
  }
}

export function charAnimation(richTextOutput, opts) {
  const i = { current: 0 }
  return React.Children.map(richTextOutput, (node) => charsWrap(node, i, opts))
}

export function CharAnimation({ children, ...opts }) {
  return charAnimation(children, opts)
}

export default CharAnimation
