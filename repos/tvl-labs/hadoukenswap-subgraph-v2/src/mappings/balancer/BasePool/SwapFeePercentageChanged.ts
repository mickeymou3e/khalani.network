import {SwapFeePercentageChanged} from "../../../types/StablePoolV2Factory/StablePool";
import { WeightedPool } from '../../../types/templates/WeightedPool/WeightedPool'
import {Pool} from "../../../types/schema";
import {scaleDown} from "../helpers/misc";

export function handleSwapFeePercentageChange(event: SwapFeePercentageChanged): void {
    let poolAddress = event.address;

    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = WeightedPool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let pool = Pool.load(poolId.toHexString()) as Pool;

    pool.swapFee = scaleDown(event.params.swapFeePercentage, 18);
    pool.save();
}
