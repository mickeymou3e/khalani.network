import Head from 'next/head'

import Header from '@/components/ui/Header'
import DataViz from '@/components/ui/DataViz'
import GetStartedCTA from '@/components/ui/GetStartedCTA'

import s from './index.module.scss'

export default function Home({ url = 'https://bittensor.com', pageTheme }) {
  return (
    <>
      <Head>
        <title>Templar</title>
        <meta name="description" content="Incentivized Internet-wide AI training" />
        <meta name="title" property="og:title" content="Templar" />
        <meta name="description" property="og:description" content="Incentivized Internet-wide AI training" />
        <meta name="image" property="og:image" content={`${url}/images/og-image.png`} />
        <meta name="type" property="og:type" content="website" />
        <meta name="url" property="og:url" content={`${url}`} />

        <meta name="twitter:title" content="Templar" />
        <meta name="twitter:description" content="Incentivized Internet-wide AI training" />
        <meta name="twitter:image" content={`${url}/images/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={s.container}>
        <Header
          lines={[
            'Incentivized<br/>Internet-wide<br/>AI training',
            'The holy grail<br/>of decentralized<br/>AI training',
            'Market-driven<br/>incentives for<br/>loss reduction',
          ]}
          pageTheme={pageTheme}
        />
        <DataViz />
        <GetStartedCTA href="https://github.com/tplr-ai/templar" />
      </div>
    </>
  )
}

Home.getInitialProps = async () => {
  return { pageTheme: 'light' }
}
