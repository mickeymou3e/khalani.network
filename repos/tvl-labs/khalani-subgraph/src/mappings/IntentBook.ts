import {
  IntentCancelled,
  IntentCreated,
  IntentLocked,
  IntentSolved,
} from "../types/IntentBook/IntentBook";
import { BridgeHistory, LiquidityHistory, OutputIntent } from "../types/schema";
import { Bytes, log } from "@graphprotocol/graph-ts";

export function handleIntentCreated(event: IntentCreated): void {
  let functionSelector = event.transaction.input.toHexString().slice(0, 10);

  if (functionSelector == "0x3ce30eba") {
    // Handle publishIntent logic
    let outcomeAssetStructure = event.params.outcomeAssetStructure;
    let fillStructure = event.params.fillStructure;

    if (fillStructure == 0) {
      let bridgeEntity = new BridgeHistory(event.params.intentId.toHex());
      bridgeEntity.transactionHash = event.transaction.hash;
      bridgeEntity.gasLimit = event.transaction.gasLimit;
      bridgeEntity.gasPrice = event.transaction.gasPrice;
      bridgeEntity.blockNumber = event.block.number.toI32();
      bridgeEntity.blockTimestamp = event.block.timestamp;
      bridgeEntity.callData = event.transaction.input;
      bridgeEntity.author = event.params.author;
      bridgeEntity.srcMToken = event.params.srcMToken;
      bridgeEntity.srcAmount = event.params.srcAmount;
      bridgeEntity.mTokens = event.params.mTokens.map<Bytes>(
        (token) => token as Bytes
      );
      bridgeEntity.mAmounts = event.params.mAmounts;
      bridgeEntity.outcomeAssetStructure = outcomeAssetStructure;
      bridgeEntity.fillStructure = fillStructure;
      bridgeEntity.status = "Pending";
      bridgeEntity.save();
    } else if (fillStructure == 2) {
      let liquidityEntity = new LiquidityHistory(event.params.intentId.toHex());
      liquidityEntity.transactionHash = event.transaction.hash;
      liquidityEntity.gasLimit = event.transaction.gasLimit;
      liquidityEntity.gasPrice = event.transaction.gasPrice;
      liquidityEntity.blockNumber = event.block.number.toI32();
      liquidityEntity.blockTimestamp = event.block.timestamp;
      liquidityEntity.callData = event.transaction.input;
      liquidityEntity.author = event.params.author;
      liquidityEntity.srcMToken = event.params.srcMToken;
      liquidityEntity.srcAmount = event.params.srcAmount;
      liquidityEntity.mTokens = event.params.mTokens.map<Bytes>(
        (token) => token as Bytes
      );
      liquidityEntity.mAmounts = event.params.mAmounts;
      liquidityEntity.outcomeAssetStructure = outcomeAssetStructure;
      liquidityEntity.fillStructure = fillStructure;
      liquidityEntity.status = "Solved";
      liquidityEntity.save();
    } else {
      log.warning("Unhandled fillStructure: {}", [fillStructure.toString()]);
    }
  } else if (functionSelector == "0x2ad75ab1") {
    // Handle solveIntent logic
    let outcomeAssetStructure = event.params.outcomeAssetStructure;
    let fillStructure = event.params.fillStructure;

    if (fillStructure == 2) {
      let id = event.params.intentId.toHex();
      if (!id) {
        log.error("IntentCreated event has a null or undefined intentId", []);
        return;
      }
  
      let outputIntents = new OutputIntent(id);
      outputIntents.transactionHash = event.transaction.hash;
      outputIntents.gasLimit = event.transaction.gasLimit;
      outputIntents.gasPrice = event.transaction.gasPrice;
      outputIntents.blockNumber = event.block.number.toI32();
      outputIntents.blockTimestamp = event.block.timestamp;
      outputIntents.callData = event.transaction.input;
      outputIntents.author = event.params.author;
      outputIntents.srcMToken = event.params.srcMToken;
      outputIntents.srcAmount = event.params.srcAmount;
      outputIntents.mTokens = event.params.mTokens.map<Bytes>(
        (token) => token as Bytes
      );
      outputIntents.mAmounts = event.params.mAmounts;
      outputIntents.outcomeAssetStructure = outcomeAssetStructure;
      outputIntents.fillStructure = fillStructure;
      outputIntents.status = "Open";
      outputIntents.save();
    } else {
      log.warning("Fill structure should be 2 for solveIntent: {}", [
        fillStructure.toString(),
      ]);
    }
  } else {
    log.warning("Unhandled functionSelector: {}", [functionSelector]);
  }
}

export function handleIntentLocked(event: IntentLocked): void {
  let intentId = event.params.intentId.toHex();
  let bridgeEntity = BridgeHistory.load(intentId);
  let liquidityEntity = LiquidityHistory.load(intentId);

  if (bridgeEntity !== null) {
    bridgeEntity.status = "Locked";
    bridgeEntity.save();
  }

  if (liquidityEntity !== null) {
    liquidityEntity.status = "Locked";
    liquidityEntity.save();
  }
}

export function handleIntentCancelled(event: IntentCancelled): void {
  let intentId = event.params.intentId.toHex();
  let bridgeEntity = BridgeHistory.load(intentId);
  let liquidityEntity = LiquidityHistory.load(intentId);

  if (bridgeEntity !== null) {
    bridgeEntity.status = "Cancelled";
    bridgeEntity.save();
  }

  if (liquidityEntity !== null) {
    liquidityEntity.status = "Cancelled";
    liquidityEntity.save();
  }
}

export function handleIntentSolved(event: IntentSolved): void {
  let intentId = event.params.intentId.toHex();
  let bridgeEntity = BridgeHistory.load(intentId);
  let liquidityEntity = LiquidityHistory.load(intentId);

  if (bridgeEntity !== null) {
    bridgeEntity.status = "Solved";
    bridgeEntity.save();
  }

  if (liquidityEntity !== null) {
    liquidityEntity.status = "Solved";
    liquidityEntity.save();
  }
}