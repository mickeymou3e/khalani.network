import {AmpUpdateStarted} from "../../../types/StablePoolV2Factory/StablePool";
import {WeightedPool} from '../../../types/templates/WeightedPool/WeightedPool'
import {AmpUpdate} from "../../../types/schema";

export function handleAmpUpdateStarted(event: AmpUpdateStarted): void {
    let poolAddress = event.address;

    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = WeightedPool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let id = event.transaction.hash.toHexString().concat(event.transactionLogIndex.toString());
    let ampUpdate = new AmpUpdate(id);
    ampUpdate.poolId = poolId.toHexString();
    ampUpdate.scheduledTimestamp = event.block.timestamp.toI32();
    ampUpdate.startTimestamp = event.params.startTime;
    ampUpdate.endTimestamp = event.params.endTime;
    ampUpdate.startAmp = event.params.startValue;
    ampUpdate.endAmp = event.params.endValue;
    ampUpdate.save();
}