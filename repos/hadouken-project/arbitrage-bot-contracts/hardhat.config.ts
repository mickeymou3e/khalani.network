import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import './type-extensions'
import 'hardhat-deploy'

const config: HardhatUserConfig = {
  solidity: '0.8.12',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      //allowUnlimitedContractSize: true,
      //chainId:1337,
      forking: {
        url: 'https://v1.mainnet.godwoken.io/rpc',
        blockNumber: 490100,
      },

      arbitrageSwapConfig: {
        vaultAddress: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
        lendingPoolAddress: '0x50ff8715E9882a6a184D51D0952Db1Eb311d1988',
        pCKBAddress: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
        WCKBAddress: '0xc296f806d15e97243a08334256c705ba5c5754cd',
      },
    },
    godwoken: {
      live: true,
      url: 'https://v1.mainnet.godwoken.io/rpc',
      chainId: 71402,
      accounts: [
        '0000000000000000000000000000000000000000000000000000000000000001',
      ],
      arbitrageSwapConfig: {
        vaultAddress: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
        lendingPoolAddress: '0x50ff8715E9882a6a184D51D0952Db1Eb311d1988',
        pCKBAddress: '0x7538c85cae4e4673253ffd2568c1f1b48a71558a',
        WCKBAddress: '0xc296f806d15e97243a08334256c705ba5c5754cd',
      },
      tags: ['mainnet'],
    },
    godwokenTestnet: {
      live: true,
      url: 'https://godwoken-testnet-v1.ckbapp.dev',
      chainId: 71401,
      accounts: [
        '0000000000000000000000000000000000000000000000000000000000000001',
      ],
      arbitrageSwapConfig: {
        vaultAddress: '0xd69FAC6C632eF023afCe7471Bda724b228237570',
        lendingPoolAddress: '0x72ddd1eca2af73024e0823C9a80B00de8e3f0070',
        pCKBAddress: '0xf3476352D9DcD38CCE088Ef6bf0812D23a58611B',
        WCKBAddress: '0xD3a77b082cF44a31B31768148539314Ac802c96C',
      },
      tags: ['testnet'],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
}

export default config
