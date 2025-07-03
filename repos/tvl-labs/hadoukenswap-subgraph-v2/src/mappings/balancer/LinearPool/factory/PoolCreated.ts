import {Address, BigDecimal} from "@graphprotocol/graph-ts";

import {PoolCreated} from "../../../../types/WeightedPoolFactory/WeightedPoolFactory";

import {LinearPool as LinearPoolTemplate} from '../../../../types/templates';
import {LinearPool} from "../../../../types/templates/LinearPool/LinearPool";

import {handlePoolCreated} from "../../BasePool/factory/PoolCreated";
import {handleNewPoolTokens, tokenToDecimal} from "../../helpers/misc";
import {getPoolTokens} from "../../helpers/pools";

export function handleLinearPoolCreated(event: PoolCreated, poolType: string): void {
    let poolAddress: Address = event.params.pool;

    let poolContract = LinearPool.bind(poolAddress);

    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let swapFeeCall = poolContract.try_getSwapFeePercentage();
    let swapFee = swapFeeCall.value;

    let pool = handlePoolCreated(event, poolId, swapFee);

    pool.poolType = poolType;
    let mainIndexCall = poolContract.try_getMainIndex();
    pool.mainIndex = mainIndexCall.value.toI32();
    let wrappedIndexCall = poolContract.try_getWrappedIndex();
    pool.wrappedIndex = wrappedIndexCall.value.toI32();

    let targetsCall = poolContract.try_getTargets();
    pool.lowerTarget = tokenToDecimal(targetsCall.value.value0, 18);
    pool.upperTarget = tokenToDecimal(targetsCall.value.value1, 18);

    let tokens = getPoolTokens(poolId);
    if (tokens == null) return;
    pool.tokensList = tokens;

    let maxTokenBalance = BigDecimal.fromString('5192296858534827.628530496329220095');
    pool.totalShares = pool.totalShares.minus(maxTokenBalance);
    pool.save();

    handleNewPoolTokens(poolId, tokens);

    LinearPoolTemplate.create(poolAddress);
}