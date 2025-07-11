import 'wipe.css'
import '@/styles/styles.scss'

import { UISideEffects } from '@/store/ui'

import Navigation from '@/components/ui/Navigation'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navigation pageTheme={pageProps.pageTheme} />
      <Component {...pageProps} />
      <UISideEffects />
    </>
  )
}
