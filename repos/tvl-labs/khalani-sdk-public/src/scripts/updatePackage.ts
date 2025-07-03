import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const pkgPath = resolve(process.cwd(), 'package.json')

const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const network = process.env.NETWORK || 'testnet'
console.log(`Current network: ${network}`)

if (network === 'mainnet') {
  pkg.name = '@tvl-labs/sdk-mainnet'
} else {
  pkg.name = '@tvl-labs/sdk-testnet'
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
console.log(`Updated package name to ${pkg.name}`)
