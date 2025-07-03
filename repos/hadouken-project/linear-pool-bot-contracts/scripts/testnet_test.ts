import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  IERC20__factory,
  ILinearPool__factory,
  IStaticATokenLM__factory,
  IVault__factory,
  LinearPoolSwap__factory,
} from "../typechain-types";

const MAINNET_RPC = "https://v1.mainnet.godwoken.io/rpc";
const TESTNET_RPC = "https://godwoken-testnet-v1.ckbapp.dev";

const MAINNET_CHAIN_ID = 71402;
const TESTNET_CHAIN_ID = 71401;

const USDC_MAINNET_ADDRESS = "0x186181e225dc1Ad85a4A94164232bD261e351C33";
const USDC_TESTNET_ADDRESS = "0x0c7F21908222098616803EfF5d054d3F4EF57EBb";

const USDT_MAINNET_ADDRESS = "0x8E019acb11C7d17c26D334901fA2ac41C1f44d50";
const USDT_TESTNET_ADDRESS = "0x30b0A247DE59a1CDF44329b756d3343E5afEd7f9";

const txOverrides = {
  gasLimit: 12_000_000,
};

async function main() {
  // USDC 0xd96f6a8DB5fdbd5b0AD13D2787d3aa14998c311b
  // USDT 0xEA8F3e38B85Bbc3958982720AAaEDd1AB81CefB1
  const linearPoolSwapAddress = "0x4EC013bb67E0b49e01437E8E64e6Ddfa332bf258";
  const userPrivateKey = "0x0secretKey";
  const rpc = MAINNET_RPC;
  const chainId = MAINNET_CHAIN_ID;
  const USDCAddress = USDC_MAINNET_ADDRESS;
  const USDTAddress = USDT_MAINNET_ADDRESS;

  const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
  const signer = new Wallet(userPrivateKey, provider);

  const loopCounter = BigNumber.from(1);
  const tokenAmount = BigNumber.from(10).pow(6).mul(1_000_000);
  const threshold = BigNumber.from(10).pow(6).mul(1_000);

  const linearPoolSwap = LinearPoolSwap__factory.connect(
    linearPoolSwapAddress,
    signer
  );

  const USDCToken = IERC20__factory.connect(USDCAddress, signer);
  const USDTToken = IERC20__factory.connect(USDTAddress, signer);

  // const wrappedUSDC = IStaticATokenLM__factory.connect(
  //   "0xe16ae54fd2b74d92f9fed49bf7fa20aab003dd60",
  //   signer
  // );
  // const vaultWrappedBalance = await wrappedUSDC.balanceOf(
  //   "0x4F8BDF24826EbcF649658147756115Ee867b7D63"
  // );

  // const ATokenUSDc = IERC20__factory.connect(
  //   "0x06c0c3ea4983d0141e79f78343Da48BaE6b61a09",
  //   signer
  // );
  // const testBalance = await USDCToken.balanceOf(ATokenUSDc.address);

  // const usdtApprove = await USDTToken.approve(
  //   linearPoolSwapAddress,
  //   tokenAmount
  // );
  // await usdtApprove.wait();

  // const tx = await linearPoolSwap.windXTimes(6, tokenAmount);
  // await tx.wait();

  // const vault = IVault__factory.connect(
  //   "0x4F8BDF24826EbcF649658147756115Ee867b7D63",
  //   signer
  // );
  // const USDTTokenInfo = await vault.getPoolTokenInfo(
  //   "0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f000000000000000000000008",
  //   "0x4Fa5AD2756ac3C62285ec896acc2d514c65F3ed3"
  // );
  // const USDCTokenInfo = await vault.getPoolTokenInfo(
  //   "0x149916d7128c36bbcebd04f794217baf51085fb9000000000000000000000008",
  //   USDCAddress
  // );
  // console.log({ vaultWrappedBalance, USDCTokenInfo, testBalance });

  const result = await linearPoolSwap.checkIfPoolIsOutsideRange(threshold);
  console.log({ result });
  if (result) {
    const aa = await linearPoolSwap.balancePool(threshold, txOverrides);
    console.log({ aa });
    await aa.wait();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
