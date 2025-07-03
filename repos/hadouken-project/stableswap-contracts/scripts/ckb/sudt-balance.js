import Web3 from "web3";
import { PolyjuiceHttpProvider, PolyjuiceWebsocketProvider } from "@polyjuice-provider/web3";

import { AddressTranslator } from "nervos-godwoken-integration";
import { Address, AddressType, default as PWCoreDefault, IndexerCollector, RawProvider, SUDT } from "@lay2/pw-core";

const PWCore = PWCoreDefault.default;

const ETHEREUM_ADDRESS = '0xD173313A51f8fc37BcF67569b463abd89d81844f';
const ETH_PRIVATE_KEY = '0xd9066ff9f753a1898709b568119055660a77d9aae4d7a4ad677b8fb3d2a571e5';

const layer1Address = new Address('ckt1qyq9u5vzgtklnqrr6cevra7w2utrsxmjgefs72sfju', AddressType.ckb);

const SUDT_ISSUER_LOCK_HASH = '0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e';

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
};

const wsProvider = new PolyjuiceWebsocketProvider('', {}, {})
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

const _config = {
    INDEXER_URL: 'http://3.235.223.161:18116',
    CKB_URL: 'http://3.235.223.161:18114'
};

(async () => {
    console.log(`Using Ethereum address: ${ETHEREUM_ADDRESS}`);
    const addressTranslator = new AddressTranslator();
    const polyjuiceAddress = addressTranslator.ethAddressToGodwokenShortAddress(ETHEREUM_ADDRESS);
    console.log(`Corresponding Polyjuice address: ${polyjuiceAddress}\n`);

    const depositAddress = await addressTranslator.getLayer2DepositAddress(web3, ETHEREUM_ADDRESS);

    console.log(`Deposit to Layer 2 address on Layer 1: \n${depositAddress.addressString}`);

    const provider = new RawProvider(ETH_PRIVATE_KEY);
    const collector = new IndexerCollector(_config.INDEXER_URL);
    const pwCore = await new PWCore(_config.CKB_URL).init(
      provider,
      collector
    );

    const sudt = new SUDT(SUDT_ISSUER_LOCK_HASH);
    const sudtBalance = await collector.getSUDTBalance(sudt, layer1Address);

    console.log(`SUDT balance: ${sudtBalance}`);
})();