require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
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
      url: "http://35.92.4.131:8000",
      accounts: [process.env.PRIVATE_KEY],
      name: "arcadia",
      mailboxAddress: "0x6C5f5086eA5C7309d5f08e715A2C167fB4Bf3045",
      eventVerifier: "0x00A6d3AD3c64733B53859aBE0dc070584E1D09Ef",
      eventProver: {
        ethereum: "0xF1e0D391643b83D1Ce7B81E7e78EE4097eFec1c4",
        avalanche: "0x40c82bab801919a4B2424f2C5012d9E01DEd7567",
      },
      aipEventPublisher: "0x337aFbDF7C7D6364791e1D68AD78afbAFB7915e4",
      aipEventHandler: "0x09854136fc22F11CA3D4EA23A84Dbf8F4015C476",
      authorizationManager: "0xEaebA7eBA36F0354164D343e53D03f188154011C",
      mTokenRegistry: "0x06c798d74eFEe421b7ddB3DB1DABbB1E76BDeea6",
      mTokenManager: "0x16B466F7b19591A9D8500695CC54D7d0fe0b81Eb",
      intentBook: "0x312156E12d1B6Fa4De4675Af173637Cc2312DD97",
      receiptManager: "0x93c08d7a4EC78A783a6763E823A39A095DE25a4f",
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
      eventVerifier: "0x6666f8D150Cb518744EAd0aC95E9a2F1c14D6849",
      eventProver: {
        avalanche: "0xdfE156D161a31f50b3513272943dF97A5989273B",
        khalani: "0x83F3955495B20e38018EFd804f8d189886949Dd4",
      },
      aipEventPublisher: "0x25465Ff21F20A00B63970FEe0312b8A3918767b9",
      aipEventHandler: "0x9ccEF1c65a0BEf30EE94fcc5aCB5bC5426F8F828",
      assetReserves: "0x865Fb7cADC47d24366c90f1BD3E218CE722CAc43",
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
      eventVerifier: "0xAb290f34eCc296022D09765f4433FF8DDDF4Aa24",
      eventProver: {
        holesky: "0xfD1D48d6a6DA8a64a4df77401423B7d9De5A652b",
        khalani: "0xEF92532Bb9881741CC7cF8c59bEcD73D90Ecb4C2",
      },
      aipEventPublisher: "0x72FF37102C313edFb546bbF2A982100A65c62B5B",
      aipEventHandler: "0x4Bd82794EFFFBE5Eee9544D709d1DD508Ed99449",
      assetReserves: "0xfE69cC79d53cd27BC9A4B39d309F309C2B614114",
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
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    viaIR: false,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};
