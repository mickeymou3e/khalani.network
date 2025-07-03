import {WeightedPool} from "../../../types/templates/WeightedPool/WeightedPool";
import {TargetsSet} from "../../../types/templates/LinearPool/LinearPool";
import {Pool} from "../../../types/schema";
import {tokenToDecimal} from "../helpers/misc";

export function handleTargetsSet(event: TargetsSet): void {
    let poolAddress = event.address;

    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = WeightedPool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let pool = Pool.load(poolId.toHexString()) as Pool;

    pool.lowerTarget = tokenToDecimal(event.params.lowerTarget, 18);
    pool.upperTarget = tokenToDecimal(event.params.upperTarget, 18);
    pool.save();
}