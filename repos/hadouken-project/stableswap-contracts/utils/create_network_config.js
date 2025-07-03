require('dotenv').config()

const fs = require('fs')
const path = require('path')

const SRC_DIR = '../src'
const CONFIG_DIR = '../config'



function create_network_config() {
    const srcDir = path.join(__dirname, SRC_DIR)
    const configDir = path.join(__dirname, CONFIG_DIR)

    const configs = fs.readdirSync(configDir)
        .map(config => [config, path.join(configDir, config)])
        .filter(([_config, configDataPath]) => !fs.lstatSync(configDataPath).isDirectory())
        .map(([_config, configDataPath]) =>  JSON.parse(fs.readFileSync(configDataPath)))
        .reduce((configByNetwork, config) => {
            const network = config.nervos.godwoken.networkId
            if (!network) return configByNetwork
            return {
                ...configByNetwork,
                [network] : config,
            }
          }, {})
    
    console.log(JSON.stringify(configs, null, 2))     
    const srcConfigDataPath = path.join(srcDir, 'config.json')

    fs.writeFileSync(srcConfigDataPath, JSON.stringify(configs, null, 2))

    return path.relative('.', srcConfigDataPath) 
}

module.exports =  {
    create_network_config
}