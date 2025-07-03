import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  ERC20Mint,
  ERC20Mint__factory,
  ERC20__factory,
  LiquidationMock,
  LiquidationMock__factory,
  TriCryptoBackstop,
  TriCryptoBackstop__factory,
} from "../src/contracts";

const depositToPool = async (
  amount: BigNumber,
  backstop: TriCryptoBackstop,
  liquidationToken: ERC20Mint
) => {
  const [owner] = await ethers.getSigners();
  await liquidationToken.mint(owner.address, amount);

  await liquidationToken.approve(backstop.address, amount);
  await backstop.deposit(amount);
};

describe("TriCrypto backstop pool tests", function () {
  let liquidationToken: ERC20Mint;
  let liquidationContract: LiquidationMock;
  let backstop: TriCryptoBackstop;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    liquidationToken = await new ERC20Mint__factory(owner).deploy(
      "TriCrypto LP",
      "TLP"
    );

    liquidationContract = await new LiquidationMock__factory(owner).deploy(
      liquidationToken.address
    );

    backstop = await new TriCryptoBackstop__factory(owner).deploy(
      liquidationToken.address,
      liquidationContract.address
    );
  });

  it("Deposit to pool without users", async function () {
    const [owner] = await ethers.getSigners();
    const triCryptoAmount = BigNumber.from(10).pow(18).mul(10);

    await depositToPool(triCryptoAmount, backstop, liquidationToken);

    const lpToken = ERC20__factory.connect(backstop.address, owner);
    const lpUserBalance = await lpToken.balanceOf(owner.address);
    expect(lpUserBalance).equals(triCryptoAmount);
  });

  it("withdraw from pool without users", async function () {
    const [owner] = await ethers.getSigners();
    const triCryptoAmount = BigNumber.from(10).pow(18).mul(10);

    await depositToPool(triCryptoAmount, backstop, liquidationToken);

    await backstop.withdraw(triCryptoAmount);
    const userBalance = await liquidationToken.balanceOf(owner.address);
    expect(userBalance).equals(triCryptoAmount);
  });

  it("When user deposit when pool have profit he get less lpTokens", async function () {
    const [owner] = await ethers.getSigners();

    const triCryptoAmountWithProfit = BigNumber.from(10).pow(18).mul(15);
    const triCryptoAmount = BigNumber.from(10).pow(18).mul(10);

    await depositToPool(triCryptoAmount, backstop, liquidationToken);

    await liquidationContract.setBackstop(backstop.address);
    await liquidationContract.setSendAmount(triCryptoAmountWithProfit);
    await liquidationToken.mint(
      liquidationContract.address,
      triCryptoAmountWithProfit
    );

    await backstop.liquidate(
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      0
    );
    await backstop.withdraw(triCryptoAmount);

    const userBalance = await liquidationToken.balanceOf(owner.address);
    expect(userBalance).equals(triCryptoAmountWithProfit);
  });
});
