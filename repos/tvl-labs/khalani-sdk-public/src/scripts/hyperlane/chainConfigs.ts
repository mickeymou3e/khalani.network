import { Network } from '@constants/Networks'

export const chainConfigs = [
  {
    name: 'holesky',
    chainId: parseInt(Network.Holesky, 16),
    domainId: parseInt(Network.Holesky, 16),
    rpcUrl: 'https://ethereum-holesky-rpc.publicnode.com',
    mailboxAddress: '0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc',
    interchainGasPaymasterAddress: '0x5CBf4e70448Ed46c2616b04e9ebc72D29FF0cfA9',
  },
  {
    name: 'arcadiatestnet2',
    chainId: parseInt(Network.Khalani, 16),
    domainId: parseInt(Network.Khalani, 16),
    rpcUrl: 'https://rpc.khalani.network',
    mailboxAddress: '0x33dB966328Ea213b0f76eF96CA368AB37779F065',
    interchainGasPaymasterAddress: '0xfBeaF07855181f8476B235Cf746A7DF3F9e386Fb',
  },
]
