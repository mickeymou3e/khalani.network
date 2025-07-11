import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useInView } from 'motion/react'
import clsx from 'clsx'

const LottieReact = dynamic(() => import('@novemberfiveco/lottie-react-light'), { ssr: false })

import s from './Lottie.module.scss'

const cachedData = {}

const Lottie = ({ url, aspectRatio = 570 / 400, allowPlay = true, forceLoad = false, loop, className }) => {
  const lottie = useRef(null)
  const [animationData, setAnimationData] = useState()

  const trigger = useRef(null)
  const shouldLoad = useInView(trigger, {
    amount: 1,
    once: true,
    margin: '50%',
  })
  const wrapper = useRef(null)
  const shouldPlay = useInView(wrapper)

  const [isLoaded, setIsLoaded] = useState(false)

  // Load animation data, check for cached data
  useEffect(() => {
    if ((!shouldLoad && !forceLoad) || !url) return
    if (!cachedData[url.toString()]) {
      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          setAnimationData(data)
        })
        .catch((error) => console.error('Failed loading Lottie animation -', error))
    } else {
      setAnimationData(JSON.parse(cachedData[url.toString()]))
    }

    const buffer = lottie.current
    return () => buffer?.destroy()
  }, [shouldLoad, forceLoad, url, setAnimationData])

  // Set cached data
  useEffect(() => {
    if (!animationData || cachedData[url]) return
    cachedData[url.toString()] = JSON.stringify(animationData)
  }, [animationData, url])

  useEffect(() => {
    if (!lottie.current || !isLoaded) return
    lottie.current[shouldPlay && allowPlay ? 'play' : 'pause']()
  }, [shouldPlay, allowPlay, isLoaded])

  return (
    <>
      <span ref={trigger} />
      <div ref={wrapper} className={clsx(s.lottieWrapper, className)} style={{ aspectRatio }}>
        <LottieReact
          lottieRef={lottie}
          className={s.lottie}
          // Only set animationData when lottie needs to play to optimize performance
          animationData={shouldPlay ? animationData : undefined}
          autoplay={true}
          onDOMLoaded={() => setIsLoaded(true)}
          loop={loop}
        />
      </div>
    </>
  )
}

export default Lottie
