import { BigNumber, constants, ethers, Signer } from 'ethers'
import { prepare_contract_abi } from '../../../utils/prepare_contracts'

import { deployer } from '../deployment.ganache'
import { connectSudtERC20Contract } from '../tokens.godwoken'

async function checkPolyjuiceAddress() {
  const contract = connectSudtERC20Contract(
    "0xe837a67761f2202dc892522b17229a102fc2894f",
    deployer,
  )
  const symbol = await contract.symbol()
  const totalSupply = await contract.totalSupply()
  
  console.log(`Token: ${symbol}`, totalSupply.toString())
}

checkPolyjuiceAddress()