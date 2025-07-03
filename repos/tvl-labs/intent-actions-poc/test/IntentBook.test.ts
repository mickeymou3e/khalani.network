import { expect } from "chai";
import hre from "hardhat";

const network = hre.network.name;

describe("IntentBook", () => {
  async function deploy() {
    if (network === "anvil") {
      console.log("Enable auto-mining");
      await hre.network.provider.send("evm_setAutomine", [true]);
    }
    let [owner, user] = await hre.viem.getWalletClients();
    if (network === "geth") {
      // geth --dev doesn't have a second account. Let's just use the same account.
      user = owner;
    }

    const mockTokenA = await hre.viem.deployContract("MockERC20", ["Token A", "TKNA"]);
    const mockTokenB = await hre.viem.deployContract("MockERC20", ["Token B", "TKNB"]);

    await mockTokenA.write.mint([owner.account.address, 1000n]);
    await mockTokenB.write.mint([user.account.address, 1000n]);

    const intentBook = await hre.viem.deployContract("IntentBook", []);

    return {
      owner,
      user,
      mockTokenA,
      mockTokenB,
      intentBook,
    };
  }

  it("should work", async () => {
    const { owner, user, mockTokenA, mockTokenB, intentBook } = await deploy();

    if (network === "anvil") {
      console.log("Disable auto-mining");
      await hre.network.provider.send("evm_setAutomine", [false]);
    }

    const intent = {
      author: owner.account.address,
      nonce: 0n,
      srcToken: mockTokenA.address,
      srcAmount: 1000n,
      dstToken: mockTokenB.address,
      dstRatioMul: 1n,
      dstRatioDiv: 2n,
    };

    const intent1 = {
      author: user.account.address,
      nonce: 1n,
      srcToken: mockTokenB.address,
      srcAmount: 500n,
      dstToken: mockTokenA.address,
      dstRatioMul: 2n,
      dstRatioDiv: 1n,
    };

    const intentHash = await intentBook.read.hashIntent([intent]);
    const intent1Hash = await intentBook.read.hashIntent([intent1]);

    const a1 = await mockTokenA.write.approve([intentBook.address, 1000n], {
      account: owner.account.address,
    });
    const a2 = await mockTokenB.write.approve([intentBook.address, 500n], {
      account: user.account.address,
    });

    console.time("whole");
    console.time("posting");
    const i1 = await intentBook.write.postIntent([intent], {
      account: owner.account.address,
    });
    const i2 = await intentBook.write.postIntent([intent1], {
      account: user.account.address,
    });
    console.timeEnd("posting");

    if (network === "axon" || network === "geth") {
      const publicClient = await hre.viem.getPublicClient();
      console.time("wait");
      const r1 = await publicClient.waitForTransactionReceipt({ hash: a1 });
      const r2 = await publicClient.waitForTransactionReceipt({ hash: a2 });
      const r3 = await publicClient.waitForTransactionReceipt({ hash: i1 });
      const r4 = await publicClient.waitForTransactionReceipt({ hash: i2 });
      expect(r1.status).to.equal("success");
      expect(r2.status).to.equal("success");
      expect(r3.status).to.equal("success");
      expect(r4.status).to.equal("success");
      console.timeEnd("wait");
    }

    const solution = {
      actions: [
        {
          intentHash: intentHash,
          spend: 1000n,
          fill: 500n,
          srcTokenIdx: 0,
          dstTokenIdx: 1,
        },
        {
          intentHash: intent1Hash,
          spend: 500n,
          fill: 1000n,
          srcTokenIdx: 1,
          dstTokenIdx: 0,
        },
      ],
      tokens: [mockTokenA.address, mockTokenB.address],
    };

    console.time("execute");
    // For axon, tx will revert with gas error if I don't set some gas parameters manually.
    const executeTx = await intentBook.write.execute(
      [solution],
      network === "axon" ? { gas: 2000000n, gasPrice: 10000000000n } : undefined,
    );
    console.timeEnd("execute");

    if (network === "axon") {
      const publicClient = await hre.viem.getPublicClient();
      console.time("wait");
      const r = await publicClient.waitForTransactionReceipt({
        hash: executeTx,
      });
      if (r.status === "reverted") {
        console.error("Transaction reverted", r);
      }
      expect(r.status).to.equal("success");
      console.timeEnd("wait");
    }

    console.time("query");
    expect(
      await mockTokenA.read.balanceOf([owner.account.address], {
        blockTag: "pending",
      }),
    ).to.equal(network === "geth" ? 1000n : 0n);

    const intent2 = await intentBook.read.getIntent([intentHash], {
      blockTag: "pending",
    });
    expect(intent2.srcAmount).to.equal(0n);

    console.timeEnd("query");
    console.timeEnd("whole");
  });
});
