import config from '@config'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

export const initSentry = (): void => {
  if (config.sentry && config.sentry !== '' && process.env.SENTRY === 'true') {
    Sentry.init({
      dsn: config.sentry,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    })
  }
}
