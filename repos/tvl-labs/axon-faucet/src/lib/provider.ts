import { ethers } from "ethers";

const {
  AXON_FAUCET_RPC_URL,
  AXON_FAUCET_CHAIN_ID,
} = process.env;

const provider = new ethers.JsonRpcProvider(
  AXON_FAUCET_RPC_URL,
  parseInt(AXON_FAUCET_CHAIN_ID!),
);

export default provider;
