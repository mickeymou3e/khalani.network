import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'

// BarnBridge Staking Contract: 
//  - https://etherscan.io/address/0xb0fa2beee3cf36a7ac7e99b885b48538ab364853#readContract

// Uniswap LP Token Contract: 
//  - https://etherscan.io/address/0x6591c4bcd6d7a1eb4e537da8b78676c1576ba244#readContract

//importing the interfaces of the smart contracts
import barnbridge_staking from './contract-interfaces/barnbridge_staking.json' 
import uniswap_bondusdc from './contract-interfaces/uniswap_bondusdc.json'

//defining the addresses at which the contracts are deployed
const BARNBRIDGE_STAKING_ADDR = "0xb0Fa2BeEe3Cf36a7Ac7E99B885b48538Ab364853"
const UNISWAP_BONDUSDC_ADDR = "0x6591c4BcD6D7A1eb4E537DA8B78676C1576Ba244"

//defining the address of our test user
const USER_ADDR = "0xb91b0e319af35145871a364f24d55f01f30c615f"

//Each Week 20'000 BOND Tokens are issued as rewards
const BOND_ISSUED_YEARLY = 20000*52

export default function Staking (){

    const context = useWeb3Context()

    let [poolValue, setPoolValue] = useState(0);
    let [userBalance, setUserBalance] = useState(0);

    let uniswap_contract = new context.library.eth.Contract(uniswap_bondusdc, UNISWAP_BONDUSDC_ADDR)
    let barnbridge_contract = new context.library.eth.Contract(barnbridge_staking, BARNBRIDGE_STAKING_ADDR)
    
    useEffect(() => {
        async function updateState() {
            
            // The getReserves method returns the amount of BOND tokens and the amount of USDC tokens
            // in the pool
            uniswap_contract.methods.getReserves().call((err:any, result:number[]) => {
                // Uniswap liquidity pools have two sides, in this case BOND and USDC, the USD value of the two 
                // sides is always equal, so we can get the amount of USDC in the pool and multiply it by 2
                // to get the total USD value of the pool

                let bondReserves = result[0] / 10**18 // adjusting for 18 decimals positions
                let usdcReserves = result[1] / 10**6 // adjusting for 6 decimals positions
                let bondPrice = bondReserves / usdcReserves; // get price of BOND from pool reserves
                setPoolValue(usdcReserves * 2)
            })

            // We get the amount of LP Tokens the user staked in the barnbridge contract
            barnbridge_contract.methods.balanceOf(USER_ADDR, UNISWAP_BONDUSDC_ADDR).call((err:any, result:number) => {
                setUserBalance(result / 10**18) // adjusting for 18 decimals positions
            })

        }
        updateState();
      }, []);

    return(
        <div>
            <p>Uniswap BOND/USDC Pool Value: {poolValue} USD</p>
            <p>User Ethereum Address: {USER_ADDR}</p>
            <p>User LP Tokens staked in Barnbridge: {userBalance}</p>
        </div>
    )
}

