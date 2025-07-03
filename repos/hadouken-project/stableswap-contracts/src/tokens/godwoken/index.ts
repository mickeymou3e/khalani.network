import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { ERC20__factory, ERC20, WCKB, WCKB__factory } from '../../contracts'

import tokensDataByNetworkJSON from '../data.json'
import { GodwokenNetwork } from "../../types";

import { TokensDataByNetwork } from '../types'

export function connectWCKB(signerOrProvider: Signer | Provider, networkId: GodwokenNetwork): WCKB | null {
  if(!Object.values(GodwokenNetwork).includes(networkId)) {
    return null
  }
  
  const tokensDataByNetwork = tokensDataByNetworkJSON as TokensDataByNetwork
  const tokensData = tokensDataByNetwork[networkId]

  const tokens = tokensData?.['wCKB']

  if (tokens) {
    const wCKB = Object.entries(tokens)
      ?.filter(([tokenSymbol, _]) => tokenSymbol.toUpperCase() === 'wCKB'.toUpperCase())
      ?.map(([_, tokenAddress]) => tokenAddress)[0]
  
    if (!wCKB) {
      return null
    }

    return WCKB__factory.connect(wCKB, signerOrProvider)
  }
  
  return null
}

export default (signerOrProvider: Signer | Provider) =>
  (tokenAddress: string): ERC20 => ERC20__factory.connect(tokenAddress, signerOrProvider)
