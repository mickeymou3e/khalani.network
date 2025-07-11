import CharAnimation from '@/components/motion/CharAnimation'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import { BodyCopy, MediumTitle, TechDetails } from '@/components/ui/Text'
import useUIStore from '@/store/ui'
import clsx from 'clsx'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import s from './research.module.scss'

export default function ResearchPage({ url = 'https://templar.ai' }) {
  const theme = useUIStore((s) => s.theme)
  const [animateBracketsIn, setAnimateBracketsIn] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateBracketsIn(true)
    }, 500) // delay for animation start
    return () => clearTimeout(timer)
  }, [])

  const whitepaperUrl = 'https://arxiv.org/pdf/2505.21684'
  const rawAbstractText =
    'We describe an incentive system for distributed deep learning of foundational models where peers are rewarded for contributions. The incentive system, Gauntlet, has been deployed on the bittensor blockchain and used to train a 1.2B LLM with completely permissionless contributions of pseudo-gradients: no control over the users that can register or their hardware. Gauntlet can be applied to any synchronous distributed training scheme that relies on aggregating updates or pseudo-gradients. We rely on a two-stage mechanism for fast filtering of peer uptime, reliability, and synchronization, combined with the core component that estimates the loss before and after individual pseudo-gradient contributions. We utilized an OpenSkill rating system to track competitiveness of pseudo-gradient scores across time. Finally, we introduce a novel mechanism to assure peers on the network perform unique computations. Our live 1.2B run, which has paid out real-valued tokens to participants based on the value of their contributions, yielded a competitive (on a per-iteration basis) 1.2B model that demonstrates the utility of our incentive system.'
  // Wrap "Gauntlet" with a span for styling
  const styledAbstractText = rawAbstractText.replace(/Gauntlet/g, `<span class=\"${s.templarRed}\">Gauntlet</span>`)

  return (
    <>
      <Head>
        <title>Research | Templar</title>
        <meta name="description" content="Read the Templar whitepaper on incentivized distributed AI training." />
        <meta name="title" property="og:title" content="Research | Templar" />
        <meta name="description" property="og:description" content="Read the Templar whitepaper on incentivized distributed AI training." />
        {/* might want to update the OG image or other meta tags specifically for this page */}
        <meta name="image" property="og:image" content={`${url}/images/og-image.png`} />
        <meta name="type" property="og:type" content="website" />
        <meta name="url" property="og:url" content={`${url}/research`} />

        <meta name="twitter:title" content="Research | Templar" />
        <meta name="twitter:description" content="Read the Templar whitepaper on incentivized distributed AI training." />
        <meta name="twitter:image" content={`${url}/images/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={s.container}>
        <Header
          pageTheme={theme} // Pass theme from store
        />
        <main className={s.mainContent}>
          <section className={s.abstractSection}>
            <MediumTitle className={s.abstractTitle}>Abstract</MediumTitle>
            <BodyCopy className={s.abstractBody} dangerouslySetInnerHTML={{ __html: styledAbstractText }} />
          </section>
          <section className={s.ctaSection}>
            <a
              href={whitepaperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(s.ctaLink, { [s.bracketsExtended]: animateBracketsIn })} // Conditionally add .bracketsExtended
            >
              <div className={s.ctaButtonContainer}>
                <TechDetails className={s.ctaText}>
                  <CharAnimation>Read The Report</CharAnimation>
                </TechDetails>
                <div className={s.ctaAnimatedBox}></div>
              </div>
            </a>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

ResearchPage.getInitialProps = async () => {
  return {} // Remove pageTheme
}
