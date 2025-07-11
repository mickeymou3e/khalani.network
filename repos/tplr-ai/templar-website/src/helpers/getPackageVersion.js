// Cache duration in seconds (2 hour)
const CACHE_DURATION = 60 * 60 * 2

export async function getPackageVersion() {
  const response = await fetch('https://raw.githubusercontent.com/tplr-ai/templar/refs/heads/main/src/tplr/__init__.py', {
    next: { revalidate: CACHE_DURATION },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status}`)
  }

  const content = await response.text()
  const versionRegex = /(?:__version__|VERSION)\s*=\s*["']([^"']+)["']/
  const match = content.match(versionRegex)

  if (!match || !match[1]) {
    throw new Error('Version not found in the file')
  }

  return match[1]
}
