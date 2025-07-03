
import fs from 'fs'
import path from 'path'

import { ethers } from 'ethers'

import { COMPILED_CONTRACTS_DIR } from '../constants'
import { POOLS_CONTRACTS_DIR } from './constants'
import { ContractCompiled } from './types'


const getNameWithNoExtension = (filename: string) => filename.split('.')[0]

export function getPoolContractName(poolName: string) {
  const poolPath = path.join(POOLS_CONTRACTS_DIR, poolName)

  const poolContractPattern = /^\w*\.vy$/

  const poolContractName = fs.readdirSync(poolPath)
    .filter(poolFile => poolContractPattern.test(poolFile))
    .map(getNameWithNoExtension)[0]

  return poolContractName
}

export function getPoolContractCompiled(
  poolContractName: string,
): ContractCompiled {
  const poolCompiledContractFile = [poolContractName, 'json'].join('.')
  const poolCompiledContractPath = path.join(COMPILED_CONTRACTS_DIR, poolCompiledContractFile)

  const poolCompiledContract = JSON.parse(fs.readFileSync(poolCompiledContractPath, 'utf8'))

  return poolCompiledContract
}