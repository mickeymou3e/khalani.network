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
    artifacts: "./artifacts", // Artifacts outputa
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
      eventVerifier: "0x5D20903ce7AC6Cb2524DB49ea6CE49AfcB5c702d",
      eventProver: {
        ethereum: "0xF1e0D391643b83D1Ce7B81E7e78EE4097eFec1c4",
        avalanche: "0x40c82bab801919a4B2424f2C5012d9E01DEd7567",
      },
      aipEventPublisher: "0x337aFbDF7C7D6364791e1D68AD78afbAFB7915e4",
      aipEventHandler: "0xCc022125a2213B1e92249D562151d5989ed21E88",
      authorizationManager: "0x994FDf12badB1B0b6DE38EfD2ff16f6Cac601A55",
      mTokenRegistry: "0x8517EBED4706256E85390f3C32E7D7E0f5791712",
      mTokenManager: "0x7Ed9885fd264CcDa7d229C37fE781653a133EB4a",
      intentBook: "0x4D65404652dDaB06aac66B7013Ec7cC3adf55F9e",
      receiptManager: "0xB51304eD7cd2f4ff3205787c4C37f062144223E6",
      mTokens: {
        avax: {
          USDC: "0xE9bd840E83AaDd687eecdCe1fA9f1B5ec9D14f54",
          USDT: "0xae9e784C31ff91bd08dD64082A3F53CCCA639c58",
          DAI: "0xE283d1d297b12cFFd47d37F745cc0E91Af75c373",
          WETH: "0x4F62CEDBc4c2EDe755aE8d1C91753Cb35Ad0B45A",
        },
        eth: {
          USDC: "0x4DeC32a58C95EAF02bCD1b545CCdC5219d31e3e5",
          USDT: "0x3347BCA6E6a8515F1a7a4b9E2f3793e7668a8eAA",
          DAI: "0xaC4B82e5547AB709499178285e5452E944a5B978",
          WETH: "0x284b43e70E2DbfecF32e2862c6F10f3A6d9f7FA0",
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
      eventVerifier: "0x77FdC0cF50232E5BDf7A000003c1cAaff769Fea5",
      eventProver: {
        avalanche: "0x2d23B360Df08f0E9A0EfE07E77F4cB5F289E7D59",
        khalani: "0xc5559f869624296FBc7905DB1c4c603F93A3518B",
      },
      aipEventPublisher: "0x318525fd3BC7C8fF500739371821c24910CFbd6b",
      aipEventHandler: "0xDD9997aeacF1ed39BD435BA14D14b9154F432069",
      assetReserves: "0x3ef036CE45A23AA224bDb72E89DF6eE2c320729E",
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
      eventVerifier: "0xa8b4a7bE46e4Ba0db9E3c628F9DCeb72A9905a43",
      eventProver: {
        ethereum: "0x6fA06d7916cCB5b1cE60757954A1425b496bF3F1",
        khalani: "0xBbEccBdC27Ce2fbfA7C079CC31C0606FAf446350",
      },
      aipEventPublisher: "0xa4D0792F3fDD3E860AaB0264b3Eb64364404E093",
      aipEventHandler: "0xC1Bb55D783a696Aa3f6d1c6f47a30b2348D88Ee4",
      assetReserves: "0x19C08EA98D0001fcce8b966A23047e413F12DC83",
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
