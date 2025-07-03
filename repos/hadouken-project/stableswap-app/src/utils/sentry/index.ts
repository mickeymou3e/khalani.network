import { getChainConfig } from '@config'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import { config } from '../../utils/network'

export const initSentry = (): void => {
  const chainConfig = getChainConfig(config.defaultChainId)
  if (Boolean(process.env.SENTRY) === false) {
    return
  }

  if (chainConfig.sentry && chainConfig.sentry !== '') {
    Sentry.init({
      dsn: chainConfig.sentry,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    })
  }
}
