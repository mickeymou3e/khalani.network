require('dotenv').config()

const fs = require('fs')
const path = require('path')

const networks = require('../networks.json')

const DEPLOYMENT_NETWORK = process.env.DEPLOYMENT_NETWORK;

const CONTRACTS_DIR = '../contracts'
const SRC_DIR = '../src'

const CONTRACTDATA_MATCH_PATTERN = /^(?<contractdata>\w*)\.?(?<network>\w*)?\.?(?<env>(prod|dev|local|test))?\.json$/


function create_tokens_data() {
  const contractsDir = path.join(__dirname, CONTRACTS_DIR)
  const srcDir = path.join(__dirname, SRC_DIR)

  const tokensDir = path.join(contractsDir, 'tokens')
  const TOKENS_DATA_NAME = 'data'

  const tokens = fs.readdirSync(tokensDir)
    .map(name => [name, path.join(tokensDir, name)])
    .filter(([_name, tokenDataPath]) => fs.lstatSync(tokenDataPath).isDirectory())
    .map(([name, tokensDataPath]) => {
      const tokenDataPath = fs.readdirSync(tokensDataPath)
      const dataObject = tokenDataPath.filter(tokensDataFileName => CONTRACTDATA_MATCH_PATTERN.test(tokensDataFileName))
        .reduce((tokensByNetwork, tokensDataFileName) => {
          const { groups: { contractdata, network, env } } = tokensDataFileName.match(CONTRACTDATA_MATCH_PATTERN)

          const networkEnv = [network, env].filter(arg => arg).join('.')

          const isDeploymentData = contractdata === TOKENS_DATA_NAME
          const isValidDeploymentDataParameters = (network || network === DEPLOYMENT_NETWORK)
          const isValidNetwork = Object.keys(networks).includes(networkEnv)

          if (
            isDeploymentData && (
              !isValidDeploymentDataParameters ||
              !isValidNetwork
            )
          ) return tokensByNetwork

          const tokensDataPath = path.join(tokensDir, name, tokensDataFileName)
          const tokensData = JSON.parse(fs.readFileSync(tokensDataPath))
          
          const networkId = networks[networkEnv]

          const data = { [name]: tokensData }
          const dataAcc = tokensByNetwork[networkId]

          const dataByNetwork = { 
            ...tokensByNetwork,
            [networkId]: {
              ...dataAcc,
              ...data,
            }
          }

          return dataByNetwork
        }, {})
      return dataObject
    })
    .reduce((dataByNetwork, contractDataByNetwork) => {
      Object.keys(contractDataByNetwork).forEach((network) => {
        const data = contractDataByNetwork[network]
        const accData = dataByNetwork[network]

        dataByNetwork[network] = {
          ...accData,
          ...data
        }

      })
      
      return dataByNetwork
    }, {})

  const srcTokensDataPath = path.join(srcDir, 'tokens', 'data.json')

  fs.writeFileSync(srcTokensDataPath, JSON.stringify(tokens, null, 2))

  return path.relative('.', srcTokensDataPath)
}

function createRegistryData() {
  const contractsDir = path.join(__dirname, CONTRACTS_DIR)
  const srcDir = path.join(__dirname, SRC_DIR)

  const registryDir = path.join(contractsDir, 'registry')
  const REGISTRY_DATA_NAME = 'deployment'

  const registryByNetwork = fs.readdirSync(registryDir)
  .filter(registryDataFileName => CONTRACTDATA_MATCH_PATTERN.test(registryDataFileName))
  .reduce((registryByNetwork, registryDataFileName) => {
    const { groups: { contractdata, network, env } } = registryDataFileName.match(CONTRACTDATA_MATCH_PATTERN)
    const networkEnv = [network, env].filter(arg => arg).join('.')

    if (
      contractdata === REGISTRY_DATA_NAME && (
        (
          (!network || network !== DEPLOYMENT_NETWORK)
        ) ||
        !Object.keys(networks).includes(networkEnv)
      )
    ) return registryByNetwork

    const registryDataPath = path.join(registryDir, registryDataFileName)
    const registryData = JSON.parse(fs.readFileSync(registryDataPath))
    
    const networkId = networks[networkEnv]
    return Object.assign({}, registryByNetwork, { [networkId]: registryData })
  }, {})

  const srcRegistryDataPath = path.join(srcDir, 'registry', 'data.json')

  fs.writeFileSync(srcRegistryDataPath, JSON.stringify(registryByNetwork, null, 2))

  return path.relative('.', srcRegistryDataPath)
}

/**
 * Creates data.json containing deployed contract's addresses
 */
function create_contracts_data() {
  console.log()
  console.log('Running contract data creation')
  console.log('DEPLOYMENT_NETWORK', DEPLOYMENT_NETWORK)

  const token_data_path = create_tokens_data()
  console.log('Token data created:', token_data_path)

  const registry_data_path = createRegistryData()
  console.log('Registry data created:', registry_data_path)
  console.log()
}

module.exports =  {
  create_contracts_data
}