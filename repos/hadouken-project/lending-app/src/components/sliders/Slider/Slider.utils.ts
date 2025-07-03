export function calculateGradientValue(
  position: number,
  gradientColors: string[],
): string {
  const normalizedPosition = position / 100

  const colors = gradientColors.map((color) =>
    isHex(color) ? color : RGBToHex(extractRGB(color) ?? [0, 0, 0]),
  )

  if (position === 100) {
    return colors[colors.length - 1]
  }

  const colorStopCount = 3
  const colorStopIndex = Math.floor(normalizedPosition * (colorStopCount - 1))

  const colorStart = colors[colorStopIndex]
  const colorEnd = colors[colorStopIndex + 1]

  const weight = normalizedPosition * (colorStopCount - 1) - colorStopIndex

  const startRGB = hexToRGB(colorStart)
  const endRGB = hexToRGB(colorEnd)

  const interpolatedRGB = interpolateRGB(startRGB, endRGB, weight)

  const interpolatedHex = RGBToHex(interpolatedRGB)

  return interpolatedHex
}

export function scaleValue(value: number, maxValue: number) {
  if (value > maxValue) return 100

  return (value * 100) / maxValue
}

function hexToRGB(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function interpolateRGB(
  startRGB: number[],
  endRGB: number[],
  weight: number,
): number[] {
  const interpolatedRGB: number[] = []
  for (let i = 0; i < 3; i++) {
    const component = Math.round(
      (1 - weight) * startRGB[i] + weight * endRGB[i],
    )
    interpolatedRGB.push(component)
  }
  return interpolatedRGB
}

function RGBToHex(rgb: number[]): string {
  let hex = '#'
  for (let i = 0; i < 3; i++) {
    const componentHex = rgb[i].toString(16).padStart(2, '0')
    hex += componentHex
  }
  return hex
}

function isHex(color: string): boolean {
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  return hexRegex.test(color)
}

function extractRGB(color: string): [number, number, number] | null {
  const rgbRegex = /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/

  const match = color.match(rgbRegex)
  if (!match) {
    return null // Return null for invalid color codes
  }

  const [, r, g, b] = match.map(Number)

  return [r, g, b]
}
