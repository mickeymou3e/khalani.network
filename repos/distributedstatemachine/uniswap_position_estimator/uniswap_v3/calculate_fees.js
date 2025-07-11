// "@uniswap/sdk": "^3.0.3",
// "ethers": "^5.7.2"
require('dotenv').config();
const { JSBI } = require("@uniswap/sdk");
const { ethers } = require('ethers');
const IUniswapV3FactoryABI = require('../abi/factory.json');
const IUniswapV3NFTmanagerABI = require("../abi/position_manager.json")
const IUniswapV3PoolABI = require('../abi/pool.json');
const ERC20Abi = require('../abi/erc20.json');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)


// V3 standard addresses mainnet
const factory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const NFTmanager = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

async function getData(tokenID){
    let FactoryContract = new ethers.Contract(factory, IUniswapV3FactoryABI, provider);

    let NFTContract =  new ethers.Contract(NFTmanager, IUniswapV3NFTmanagerABI, provider);
    let position = await NFTContract.positions(tokenID);

    let token0contract =  new ethers.Contract(position.token0, ERC20Abi, provider);
    let token1contract =  new ethers.Contract(position.token1, ERC20Abi, provider);
    let Decimal0 = await token0contract.decimals();
    let Decimal1 = await token1contract.decimals();

    let token0sym = await token0contract.symbol();
    let token1sym = await token1contract.symbol();

    let V3pool = await FactoryContract.getPool(position.token0, position.token1, position.fee);
    let poolContract = new ethers.Contract(V3pool, IUniswapV3PoolABI, provider);

    let slot0 = await poolContract.slot0();
    let tickLow = await poolContract.ticks(position.tickLower.toString());
    let tickHi = await poolContract.ticks(position.tickUpper.toString());

    let feeGrowthGlobal0 = await poolContract.feeGrowthGlobal0X128();
    let feeGrowthGlobal1 = await poolContract.feeGrowthGlobal1X128();
    console.log(feeGrowthGlobal0.toString());

    let pairName = token0sym +"/"+ token1sym;

    let PoolInfo = {
        "SqrtX96" : slot0.sqrtPriceX96.toString(),
        "Pair": pairName,
        "Decimal0": Decimal0,
        "Decimal1": Decimal1,
        "tickCurrent": slot0.tick,
        "tickLow": position.tickLower,
        "tickHigh": position.tickUpper,
        "liquidity": position.liquidity.toString(),
        "feeGrowth0Low": tickLow.feeGrowthOutside0X128.toString(),
        "feeGrowth0Hi": tickHi.feeGrowthOutside0X128.toString(),
        "feeGrowth1Low": tickLow.feeGrowthOutside1X128.toString(),
        "feeGrowth1Hi": tickHi.feeGrowthOutside1X128.toString(),
        "feeGrowthInside0LastX128": position.feeGrowthInside0LastX128.toString(),
        "feeGrowthInside1LastX128": position.feeGrowthInside1LastX128.toString(),
        "feeGrowthGlobal0X128": feeGrowthGlobal0.toString(),
        "feeGrowthGlobal1X128": feeGrowthGlobal1.toString()}

    return PoolInfo
}

const ZERO = JSBI.BigInt(0);
const Q128 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128));
const Q256 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(256));

function toBigNumber(numstr){
    let bi = numstr;
    if (typeof sqrtRatio !== 'bigint') {
        bi = JSBI.BigInt(numstr);
    }
    return bi;
};


function subIn256(x, y){
    const difference = JSBI.subtract(x, y)

    if (JSBI.lessThan(difference, ZERO)) {
        return JSBI.add(Q256, difference)
    } else {
        return difference
    }
}

async function getData(tokenID){
    let FactoryContract = new ethers.Contract(factory, IUniswapV3FactoryABI, provider);

    let NFTContract =  new ethers.Contract(NFTmanager, IUniswapV3NFTmanagerABI, provider);
    let position = await NFTContract.positions(tokenID);
    let token0contract =  new ethers.Contract(position.token0, ERC20Abi, provider);
    let token1contract =  new ethers.Contract(position.token1, ERC20Abi, provider);
    let Decimal0 = await token0contract.decimals();
    let Decimal1 = await token1contract.decimals();

    let token0sym = await token0contract.symbol();
    let token1sym = await token1contract.symbol();

    let V3pool = await FactoryContract.getPool(position.token0, position.token1, position.fee);
    let poolContract = new ethers.Contract(V3pool, IUniswapV3PoolABI, provider);

    let slot0 = await poolContract.slot0();
    let tickLow = await poolContract.ticks(position.tickLower.toString());
    let tickHi = await poolContract.ticks(position.tickUpper.toString());

    let feeGrowthGlobal0 = await poolContract.feeGrowthGlobal0X128();
    let feeGrowthGlobal1 = await poolContract.feeGrowthGlobal1X128();
    console.log(feeGrowthGlobal0.toString());

    let pairName = token0sym +"/"+ token1sym;

    let PoolInfo = {
        "SqrtX96" : slot0.sqrtPriceX96.toString(),
        "Pair": pairName,
        "Decimal0": Decimal0,
        "Decimal1": Decimal1,
        "tickCurrent": slot0.tick,
        "tickLow": position.tickLower,
        "tickHigh": position.tickUpper,
        "liquidity": position.liquidity.toString(),
        "feeGrowth0Low": tickLow.feeGrowthOutside0X128.toString(),
        "feeGrowth0Hi": tickHi.feeGrowthOutside0X128.toString(),
        "feeGrowth1Low": tickLow.feeGrowthOutside1X128.toString(),
        "feeGrowth1Hi": tickHi.feeGrowthOutside1X128.toString(),
        "feeGrowthInside0LastX128": position.feeGrowthInside0LastX128.toString(),
        "feeGrowthInside1LastX128": position.feeGrowthInside1LastX128.toString(),
        "feeGrowthGlobal0X128": feeGrowthGlobal0.toString(),
        "feeGrowthGlobal1X128": feeGrowthGlobal1.toString()}

    return PoolInfo
}

async function getFees(feeGrowthGlobal0, feeGrowthGlobal1, feeGrowth0Low, feeGrowth0Hi, feeGrowthInside0, feeGrowth1Low, feeGrowth1Hi, feeGrowthInside1, liquidity, decimals0, decimals1, tickLower, tickUpper, tickCurrent){

    let feeGrowthGlobal_0 = toBigNumber(feeGrowthGlobal0);
    let feeGrowthGlobal_1 = toBigNumber(feeGrowthGlobal1);

    let tickLowerFeeGrowthOutside_0 = toBigNumber(feeGrowth0Low);
    let tickLowerFeeGrowthOutside_1 = toBigNumber(feeGrowth1Low);
    let tickUpperFeeGrowthOutside_0 = toBigNumber(feeGrowth0Hi);
    let tickUpperFeeGrowthOutside_1 = toBigNumber(feeGrowth1Hi);

    let tickLowerFeeGrowthBelow_0 = ZERO;
    let tickLowerFeeGrowthBelow_1 = ZERO;
    let tickUpperFeeGrowthAbove_0 = ZERO;
    let tickUpperFeeGrowthAbove_1 = ZERO;

    if (tickCurrent >= tickUpper){
        tickUpperFeeGrowthAbove_0 = subIn256(feeGrowthGlobal_0, tickUpperFeeGrowthOutside_0);
        tickUpperFeeGrowthAbove_1 = subIn256(feeGrowthGlobal_1, tickUpperFeeGrowthOutside_1);
    }else{
        tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0
        tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1
    }

    if (tickCurrent >= tickLower){
        tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0
        tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1
    }else{
        tickLowerFeeGrowthBelow_0 = subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthOutside_0);
        tickLowerFeeGrowthBelow_1 = subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthOutside_1);
    }

    let fr_t1_0 = subIn256(subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthBelow_0), tickUpperFeeGrowthAbove_0);
    let fr_t1_1 = subIn256(subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthBelow_1), tickUpperFeeGrowthAbove_1);

    let feeGrowthInsideLast_0 = toBigNumber(feeGrowthInside0);
    let feeGrowthInsideLast_1 = toBigNumber(feeGrowthInside1);

    let uncollectedFees_0 = (liquidity * subIn256(fr_t1_0, feeGrowthInsideLast_0)) / Q128;
    let uncollectedFees_1 = (liquidity * subIn256(fr_t1_1, feeGrowthInsideLast_1)) / Q128;

    let uncollectedFeesAdjusted_0 = (uncollectedFees_0 / toBigNumber(10**decimals0)).toFixed(decimals0);
    let uncollectedFeesAdjusted_1 = (uncollectedFees_1 / toBigNumber(10**decimals1)).toFixed(decimals1);
    return [uncollectedFeesAdjusted_0, uncollectedFeesAdjusted_1];   
}

const positionId = process.argv[2];



async function start(positionId){
    try {
        let poolInfo = await getData(positionId);
        let fees = await getFees(
                poolInfo.feeGrowthGlobal0X128,
                poolInfo.feeGrowthGlobal1X128,
                poolInfo.feeGrowth0Low,
                poolInfo.feeGrowth0Hi,
                poolInfo.feeGrowthInside0LastX128,
                poolInfo.feeGrowth1Low,
                poolInfo.feeGrowth1Hi,
                poolInfo.feeGrowthInside1LastX128,
                poolInfo.liquidity,
                poolInfo.Decimal0,
                poolInfo.Decimal1,
                poolInfo.tickLow,
                poolInfo.tickHigh,
                poolInfo.tickCurrent
            );
            console.log(fees.join(' '));
    } catch (error) {
        console.log(error);
    }
    
}

start(positionId);