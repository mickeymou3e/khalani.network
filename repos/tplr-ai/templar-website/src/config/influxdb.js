import { getPackageVersion } from '@/helpers/getPackageVersion'

/**
 * Adds protocol if missing.
 */
function addProtocolIfMissing(url) {
  if (!url.match(/^(https?:)\/\//)) {
    return `https://${url}`
  }
  return url
}

/**
 * Normalizes the URL by adding the default port (8086) if not set.
 */
function normalizeUrl(url) {
  let normalized = addProtocolIfMissing(url)
  try {
    const parsed = new URL(normalized)
    if (!parsed.port) {
      parsed.port = '8086'
      return parsed.toString()
    }
    return normalized
  } catch (e) {
    console.error('Error normalizing URL:', e)
  }
  return normalized
}

// Default configuration for InfluxDB
export const influxConfig = {
  url: normalizeUrl(process.env.INFLUXDB_URL || 'https://uaepr2itgl-tzxeth774u3fvf.timestream-influxdb.us-east-2.on.aws'),
  token: process.env.INFLUXDB_TOKEN,
  org: process.env.INFLUXDB_ORG || 'templar',
  bucket: process.env.INFLUXDB_BUCKET || 'tplr',
  getVersion: async () => {
    if (process.env.MINER_VERSION) {
      console.log('Using env version', process.env.MINER_VERSION)
      return process.env.MINER_VERSION
    }

    const packageVersion = await getPackageVersion()
    console.log('Using resolved package version', packageVersion)
    return packageVersion
  },
}
