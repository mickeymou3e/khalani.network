import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./type-extensions";
import "hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
      },
    ],
  },
  defaultNetwork: "godwokenTestnet",
  networks: {
    godwoken: {
      live: true,
      url: "https://v1.mainnet.godwoken.io/rpc",
      chainId: 71402,
      accounts: [
        "8bd4681b1b8218318157e26fbc07c2c1a8cc9fc2831954cdf0e89cbd10af8784",
      ],
      linearPoolSwapConfigs: [
        {
          vaultAddress: "0x4F8BDF24826EbcF649658147756115Ee867b7D63",
          lendingPoolAddress: "0x50ff8715E9882a6a184D51D0952Db1Eb311d1988",
          tokenAddress: "0x186181e225dc1Ad85a4A94164232bD261e351C33",
          wrappedHTokenAddress: "0xe16ae54fd2b74d92f9fed49bf7fa20aab003dd60",
          linearPoolAddress: "0x149916d7128c36bbcebd04f794217baf51085fb9",
          poolId:
            "0x149916d7128c36bbcebd04f794217baf51085fb9000000000000000000000008",
        },
        {
          vaultAddress: "0x4F8BDF24826EbcF649658147756115Ee867b7D63",
          lendingPoolAddress: "0x50ff8715E9882a6a184D51D0952Db1Eb311d1988",
          tokenAddress: "0x8E019acb11C7d17c26D334901fA2ac41C1f44d50",
          wrappedHTokenAddress: "0xb434d6E7945C755c6B16DF386A4b0BE2bfd2d4a5",
          linearPoolAddress: "0xa0430f122fb7e4f6f509c9cb664912c2f01db3e2",
          poolId:
            "0xa0430f122fb7e4f6f509c9cb664912c2f01db3e2000000000000000000000009",
        },
      ],
      tags: ["mainnet"],
    },
    godwokenTestnet: {
      live: true,
      url: "https://godwoken-testnet-v1.ckbapp.dev",
      chainId: 71401,
      linearPoolSwapConfigs: [
        {
          vaultAddress: "0xd69FAC6C632eF023afCe7471Bda724b228237570",
          lendingPoolAddress: "0x72ddd1eca2af73024e0823C9a80B00de8e3f0070",
          tokenAddress: "0x0c7F21908222098616803EfF5d054d3F4EF57EBb",
          wrappedHTokenAddress: "0x70a58262bc55fbf3965bd1c0861e3ddf1a253777",
          linearPoolAddress: "0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d",
          poolId:
            "0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d000000000000000000000009",
        },
        {
          vaultAddress: "0xd69FAC6C632eF023afCe7471Bda724b228237570",
          lendingPoolAddress: "0x72ddd1eca2af73024e0823C9a80B00de8e3f0070",
          tokenAddress: "0x30b0A247DE59a1CDF44329b756d3343E5afEd7f9",
          wrappedHTokenAddress: "0x4Fa5AD2756ac3C62285ec896acc2d514c65F3ed3",
          linearPoolAddress: "0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f",
          poolId:
            "0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f000000000000000000000008",
        },
      ],
      accounts: [
        "8bd4681b1b8218318157e26fbc07c2c1a8cc9fc2831954cdf0e89cbd10af8784",
      ],
      tags: ["testnet"],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;
