require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  paths: {
    sources: "./src", // Your source contracts directory
    tests: "./test", // Your test directory
    cache: "./cache", // Cache for compiled files
    artifacts: "./artifacts", // Artifacts output
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://1rpc.io/holesky`,
        blockNumber: 2464435,
      },
      chainId: 1337,
    },
    khalani: {
      url: "https://rpc.khalani.network",
      accounts: [process.env.PRIVATE_KEY],
      name: "arcadia",
      mailboxAddress: "0xDDcFEcF17586D08A5740B7D91735fcCE3dfe3eeD",
      eventVerifier: "0x5700c8569Adb38aBb830F853A05ef33F2112f3E3",
      eventProver: {
        holesky: "0x1E587Ddedaa8d5C738fCcD8D56e9871d6a3E040D",
        avalanche: "0xc68156FFAd7f6d638C4Da9Bd627c46B551e9984C",
      },
      aipEventPublisher: "0xdAB0E0916D22009f4234b93E7943a9f8CE1e7BFB",
      aipEventHandler: "0xb9Ad8F06ED616D995c6890fA5BeA9822bcBEe53E",
      interchainGasPaymaster: "0xEa7e618Bee8927fBb2fA20Bc41eE8DEA51838aAD",
      authorizationManager: "0x8cbcd3F7Eb28fEcFCCFa0c37081186651CC041A6",
      mTokenRegistry: "0x3D06680F4348812bFCD91A68caAa7c82AA59B6cd",
      mTokenManager: "0x9B03e72dD8Fa5C268b83EBB1C17721012533DDDB",
      intentBook: "0x79Cff9ba2bf85C4b7f963864bd25dE87aAC53c9c",
      receiptManager: "0xfeE86f2Fc92f914244780E76F94694c1B6a27E03",
      mTokens: {
        avax: {
          USDC: "0xDCFee5baD09Cf939D13C37F5a3c279c321671142",
          USDT: "0xE0140Cc480a816f1484727c48fE21993Cc4C8654",
          DAI: "0x2c6420D0DDd32a37855d3b1c2fc935172EE108be",
          WETH: "0x1B9c305553CB8C582014d4dEC49106dED9797664",
        },
        // eth: {
        //   USDC: "0x86bfAB3625B922841ab45E871A93Dd0341E247ea",
        //   USDT: "0xF5630CA4bA79916F4F633db6D092fDb6a0079F51",
        //   DAI: "0xCe0Ae8DfF00a93F5F6886aA9A3d13c88Ec9Dfbb5",
        //   WETH: "0x9e0E9f381969ae99aBB1636E6DFc16161B910E26",
        // },
        holesky: {
          USDC: "0x86bfAB3625B922841ab45E871A93Dd0341E247ea",
          USDT: "0xF5630CA4bA79916F4F633db6D092fDb6a0079F51",
          DAI: "0xCe0Ae8DfF00a93F5F6886aA9A3d13c88Ec9Dfbb5",
          WETH: "0x9e0E9f381969ae99aBB1636E6DFc16161B910E26",
        },
      },
      isArcadia: true,
    },
    holesky: {
      url: `https://1rpc.io/holesky`,
      accounts: [process.env.PRIVATE_KEY],
      name: "holesky",
      mailboxAddress: "0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc",
      interchainGasPaymaster: "0x5CBf4e70448Ed46c2616b04e9ebc72D29FF0cfA9",
      eventVerifier: "0xE3C04D123abB617535783a16ac764aa643f12Ae7",
      eventProver: {
        avalanche: "0x5A76278fD59C3D9BF6A8D5e1e273C60755088106",
        khalani: "0x54B02fEEf19147797c081e404C2c9bc90A7Fb731",
      },
      aipEventPublisher: "0x46c8A8F06F43B2a10D52265196D7356b9a91C460",
      aipEventHandler: "0x990EEbe7BDc5309e13818F5d21E497b918434CBB",
      assetReserves: "0xD924f2d7f4E24F1dC92a1eECF2fe3725CB128893",
      tokens: {
        USDC: "0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626",
        USDT: "0xfE69cC79d53cd27BC9A4B39d309F309C2B614114",
        DAI: "0xADe4cDe8B0a9a5fc9e8784b8a823C990a12ba240",
        WETH: "0x89bb1EE37a1C79B18DEcC071e8F691F26032c8F0",
      },
      isArcadia: false,
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    ethereum: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [process.env.PRIVATE_KEY],
      name: "sepolia",
      mailboxAddress: "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766",
      interchainGasPaymaster: "0x6f2756380FD49228ae25Aa7F2817993cB74Ecc56",
      eventVerifier: "0x89d1118E428ACa0261824074b947D1CADf4DC514",
      eventProver: {
        avalanche: "0x93E006Ef71BFD6E1497d2f5b924f9386810C6FE1",
        khalani: "0x1dF669FbB6b7866B6421A252E69066E16510B1aa",
      },
      aipEventPublisher: "0xaC28F48c835fA1Faa510e7C31A6E308882f1C097",
      //TO-DO: deploy
      aipEventHandler: "",
      assetReserves: "",
      tokens: {
        USDC: "0xeAa5cbBc599556be8d182488aF6b3b89e10c10F3",
        USDT: "0x19C08EA98D0001fcce8b966A23047e413F12DC83",
        DAI: "0x5D20903ce7AC6Cb2524DB49ea6CE49AfcB5c702d",
        WETH: "0xFe3C69De114047C6b43a9b40D72001f06D4f3782",
      },
      isArcadia: false,
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    avalanche: {
      url: "https://avalanche-fuji-c-chain-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      name: "fuji",
      mailboxAddress: "0x5b6CFf85442B851A8e6eaBd2A4E4507B5135B3B0",
      interchainGasPaymaster: "0x6895d3916B94b386fAA6ec9276756e16dAe7480E",
      eventVerifier: "0x851A2123836eECAaA1B04AafAF3034ebE8184Df6",
      eventProver: {
        holesky: "0x07FAa2e1A006a3bBc1266074fAbbef1359a899A3",
        khalani: "0x35421e25C36938879F8D5481404D8d08075e8CDA",
      },
      aipEventPublisher: "0xbb4dC8a32DA5e422143f0cAc41AfFce1Dca97784",
      aipEventHandler: "0xA097fBF6ABc0f4301DcCc704cE5b93F761428BC8",
      assetReserves: "0xB837D24c6B3eeC87301F22585364A71609c0f375",
      tokens: {
        USDC: "0x277cAAC382cb1b1087598e710bCf96bAF218f9F9",
        USDT: "0x083F108e8302138230fAf206B6d3965C1969b6FA",
        DAI: "0x26FaF3BB5f1201168600ca87f987dfCdB3a9aEEe",
        WETH: "0x390b45e024aC78A1fF0AF9322895123EB0c25DBb",
      },
      isArcadia: false,
      permit2: "0x8A82255fafcBB9E02273e918eE90AEd6B864E04c",
    },
  },
};
