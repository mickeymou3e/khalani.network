import {Address, BigInt} from "@graphprotocol/graph-ts";

import {AmpUpdateStopped} from "../../../types/StablePoolV2Factory/StablePool";
import {WeightedPool} from '../../../types/templates/WeightedPool/WeightedPool'
import {AmpUpdate, Pool} from "../../../types/schema";
import {StablePool} from "../../../types/templates/StablePool/StablePool";
import {ZERO} from "../helpers/constants";

export function handleAmpUpdateStopped(event: AmpUpdateStopped): void {
    let poolAddress = event.address;

    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = WeightedPool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value.toHexString();

    let id = event.transaction.hash.toHexString().concat(event.transactionLogIndex.toString());
    let ampUpdate = new AmpUpdate(id);
    ampUpdate.poolId = poolId;
    ampUpdate.scheduledTimestamp = event.block.timestamp.toI32();
    ampUpdate.startTimestamp = event.block.timestamp;
    ampUpdate.endTimestamp = event.block.timestamp;
    ampUpdate.startAmp = event.params.currentValue;
    ampUpdate.endAmp = event.params.currentValue;
    ampUpdate.save();

    let pool = Pool.load(poolId);
    if (pool == null) return;
    updateAmpFactor(pool);
}

export function getAmp(poolContract: StablePool): BigInt {
    let ampCall = poolContract.try_getAmplificationParameter();
    let amp = ZERO;
    if (!ampCall.reverted) {
        let value = ampCall.value.value0;
        let precision = ampCall.value.value2;
        amp = value.div(precision);
    }
    return amp;
}

export function updateAmpFactor(pool: Pool): void {
    let poolContract = StablePool.bind(changetype<Address>(pool.address));

    pool.amp = getAmp(poolContract);

    pool.save();
}
