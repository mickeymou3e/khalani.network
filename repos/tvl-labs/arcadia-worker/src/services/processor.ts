import { arcadiaSDK } from "../config";
import { markError, markSuccess, getDepositById } from "./depositService";
import { AppError } from "../utils/errors";

export async function processDeposit(
  depositId: string,
  payload?: {
    userAddress: string;
    expectedBalance: bigint;
    tokenAddress: string;
    chainId: number;
    intent: any;
    intentSignature: string;
    depositTx: string;
  }
): Promise<void> {
  console.log(`🔄 Processing deposit ${depositId}...`);

  const rec = payload
    ? payload
    : await getDepositById(depositId).then((r) => {
        if (!r) throw new AppError("NOT_FOUND", "Deposit not found", 404);
        console.log(`📋 Retrieved deposit data for ${depositId}`);
        return {
          userAddress: r.userAddress,
          expectedBalance: BigInt(r.amount),
          tokenAddress: r.tokenAddress,
          chainId: Number(r.intent.chainId),
          intent: r.intent,
          intentSignature: r.intentSignature!,
          depositTx: r.depositTx,
        };
      });

  // 1) wait for mint
  console.log(`⏳ Waiting for minting to complete...`);
  try {
    const minted = await arcadiaSDK.balanceService.waitForMinting(
      { address: rec.tokenAddress, chainId: String(rec.chainId) },
      rec.expectedBalance,
      rec.userAddress
    );
    if (!minted) {
      console.log(`❌ Minting timed out for deposit ${depositId}`);
      await markError(depositId, "ExecTimeout");
      return;
    }
    console.log(`✅ Minting confirmed for deposit ${depositId}`);
  } catch (err: any) {
    console.error(`❌ Error waiting for minting: ${err.message}`);
    await markError(depositId, `ExecTimeout: ${err.message}`);
    return;
  }

  // 2) propose intent
  console.log(`📝 Proposing intent for deposit ${depositId}...`);
  try {
    const proposeIntentResponse = await arcadiaSDK.intentService.proposeIntent({
      refineResult: rec.intent,
      signature: rec.intentSignature,
    });
    console.log(
      `✅ Intent successfully proposed for deposit ${depositId} with intentId: ${proposeIntentResponse.intentId}`
    );

    // 3) mark success with intentId
    console.log(`🎉 Marking deposit ${depositId} as successful`);
    await markSuccess(depositId, proposeIntentResponse.intentId);
    console.log(`✅ Deposit ${depositId} processing completed successfully`);
  } catch (err: any) {
    console.error(`❌ Error proposing intent: ${err.message}`);
    await markError(depositId, `PublishRevert: ${err.message}`);
    return;
  }
}
