require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");
require("./scripts/extractAddresses");

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
    sources: "./src", // Your source contracts directorya
    tests: "./test", // Your test directory
    cache: "./cache", // Cache for compiled files
    artifacts: "./artifacts", // Artifacts output
  },
  networks: {
    khalani: {
      url: "https://rpc.khalani.network",
      accounts: [process.env.PRIVATE_KEY],
      name: "arcadia",
      chainId: 1098411886,
      mTokenCrossChainAdapter: "0xc8b7E10A48797F101F387FFa327cA72f8DAEd9D3",
      eventPublisher: "0xB8b96DD40372e4C00Eb3d0ed9558Dc0914450C86",
      eventHandler: "0x6D998AFAe77E3342ED1cffa4bA9ED850e1aa3444",
      mailboxAddress: "0x33dB966328Ea213b0f76eF96CA368AB37779F065",
      gasAmountOracle: "0xB82eA265316A15F033A27875fd5d72f6dca91C47",
      eventVerifier: "0x699331F08e1C267197fFf2776824a25BacaC69c1",
      eventProver: {
        holesky: "0xEa13519dC74716692806a4A3E4785112B5A660a5",
        avalanche: "0x3011f2600AbA76444b188069E00D20ac6cfc3344",
      },
      aipEventPublisher: "0x0000000000000000000000000000000000000000",
      aipEventHandler: "0xB44357b06282FeC1177357Da5e9fF16F6EA656F0",
      interchainGasPaymaster: "0xfBeaF07855181f8476B235Cf746A7DF3F9e386Fb",
      authorizationManager: "0xF6a0C5f05118d6375714341aC87bd3ba36096Fa0",
      mTokenRegistry: "0xcD21508EF3B4BB1C90e529A211207927dcfc2Ad5",
      mTokenManager: "0x451B55f91c217ab85dE6D41142Fd5a4aE6e877BD",
      intentBook: "0xe9B1e36680E435A900fC3d4Fe52b66BE04E2175b",
      receiptManager: "0x8ba8f8633C716c42d8574239B53A0fD12af13288",
      mTokens: {
        avax: {
          USDC: "0xE7b9A281847dD014ef5FB2c6e9Bf165ef123d5f2",
          USDT: "0xd2872537E00fB7365720F3c5036c5a1e4b7202B5",
          DAI: "0xbEfe438a775884c0DD2329dBC42Fc6f5b62dFaC5",
          WETH: "0xE7510Ad104e70D1f035B58375f4A7DF564b2F062",
        },
        // eth: {
        //   USDC: "0x86bfAB3625B922841ab45E871A93Dd0341E247ea",
        //   USDT: "0xF5630CA4bA79916F4F633db6D092fDb6a0079F51",
        //   DAI: "0xCe0Ae8DfF00a93F5F6886aA9A3d13c88Ec9Dfbb5",
        //   WETH: "0x9e0E9f381969ae99aBB1636E6DFc16161B910E26",
        // },
        holesky: {
          USDC: "0xD4a888D6c74803b721913617946387530Da6A7b1",
          USDT: "0xbDf39752810236C8177B3AaA957D659649715DB3",
          DAI: "0xC7F7c0699bBFb0C52165AdCEB2b6A5AF844Ba812",
          WETH: "0x413093FC2881EefD61B5994AcB98068fc9B263D5",
        },
      },
      medusaDeployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      isArcadia: true,
    },
    holesky: {
      url: `https://1rpc.io/holesky`,
      accounts: [process.env.PRIVATE_KEY],
      name: "holesky",
      chainId: 17000,
      mailboxAddress: "0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc",
      gasAmountOracle: "0xD89CD1E177D50De127CFB53Ea6d80c16Cb1b4792",
      interchainGasPaymaster: "0x5CBf4e70448Ed46c2616b04e9ebc72D29FF0cfA9",
      eventPublisher: "0x1A324854b95533629579E718ee8495dC219bC7b6",
      eventHandler: "0x6C6cEA02c5E56AeC97dDad12E68FF93C9812d6Be",
      eventVerifier: "0x869Df16aEA0d1581c841f41983FB49F47E25f18b",
      eventProver: {
        avalanche: "0x2c030EF70c43A519b277Eb02e5F288F2695c6DEf",
        khalani: "0x66Ae1D85982529B6CAB8885BaBD53de35A1a8289",
      },
      aipEventPublisher: "0x16B466F7b19591A9D8500695CC54D7d0fe0b81Eb",
      aipEventHandler: "0x644eFA7B8d884240B843ab6b4125205d1551505A",
      assetReserves: "0x489c4fF4625a80C2d02FCFd29CBabA1e964551F0",
      tokens: {
        USDC: "0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626",
        USDT: "0xfE69cC79d53cd27BC9A4B39d309F309C2B614114",
        DAI: "0xADe4cDe8B0a9a5fc9e8784b8a823C990a12ba240",
        WETH: "0x89bb1EE37a1C79B18DEcC071e8F691F26032c8F0",
      },
      isArcadia: false,
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
    avalanche: {
      url: "https://avalanche-fuji-c-chain-rpc.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
      name: "fuji",
      chainId: 43113,
      mailboxAddress: "0x5b6CFf85442B851A8e6eaBd2A4E4507B5135B3B0",
      gasAmountOracle: "0x038364390bA59c89665573b0b2A7f0d61856C107",
      interchainGasPaymaster: "0x6895d3916B94b386fAA6ec9276756e16dAe7480E",
      eventPublisher: "0x118B2b75Ef8FE3d08b4041705De8E93225F85b11",
      eventHandler: "0x4d018E5F370247B7D372d0A6666d76Cb9c977a29",
      eventVerifier: "0xcfeF1912628Ad9710f8135810d378B8D6835a93F",
      eventProver: {
        holesky: "0xB3B829D814590C099092F153F1cc2326F563a841",
        khalani: "0x4536B3f327B030cae8171644653B3c39D304E31C",
      },
      aipEventPublisher: "0xD3A181BcC887555819c8a4e7cD199659B7e30a0e",
      aipEventHandler: "0x72Ced0541C7A20d9910535C2B528A4B19E7E8a54",
      assetReserves: "0x6906cdB3f26bCF8F1dB7396e5260C1C88D193Afc",
      tokens: {
        USDC: "0x277cAAC382cb1b1087598e710bCf96bAF218f9F9",
        USDT: "0x083F108e8302138230fAf206B6d3965C1969b6FA",
        DAI: "0x26FaF3BB5f1201168600ca87f987dfCdB3a9aEEe",
        WETH: "0x390b45e024aC78A1fF0AF9322895123EB0c25DBb",
      },
      isArcadia: false,
      permit2: "0x8A82255fafcBB9E02273e918eE90AEd6B864E04c",
    },
    ethereum: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [process.env.PRIVATE_KEY],
      name: "sepolia",
      mailboxAddress: "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766",
      interchainGasPaymaster: "0x6f2756380FD49228ae25Aa7F2817993cB74Ecc56",
      eventPublisher: "0x",
      eventHandler: "0x",
      eventVerifier: "0x0000000000000000000000000000000000000000",
      eventProver: {
        avalanche: "0x0000000000000000000000000000000000000000",
        khalani: "0x0000000000000000000000000000000000000000",
      },
      aipEventPublisher: "0x0000000000000000000000000000000000000000",
      aipEventHandler: "0x0000000000000000000000000000000000000000",
      assetReserves: "0x0000000000000000000000000000000000000000",
      tokens: {
        USDC: "0xeAa5cbBc599556be8d182488aF6b3b89e10c10F3",
        USDT: "0x19C08EA98D0001fcce8b966A23047e413F12DC83",
        DAI: "0x5D20903ce7AC6Cb2524DB49ea6CE49AfcB5c702d",
        WETH: "0xFe3C69De114047C6b43a9b40D72001f06D4f3782",
      },
      isArcadia: false,
      permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    },
  },
};
