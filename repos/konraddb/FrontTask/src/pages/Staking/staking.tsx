import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";

// BarnBridge Staking Contract:
//  - https://etherscan.io/address/0xb0fa2beee3cf36a7ac7e99b885b48538ab364853#readContract

// Uniswap LP Token Contract:
//  - https://etherscan.io/address/0x6591c4bcd6d7a1eb4e537da8b78676c1576ba244#readContract

//importing the interfaces of the smart contracts
import barnbridge_staking from "../../components/contract-interfaces/barnbridge_staking.json";
import uniswap_bondusdc from "../../components/contract-interfaces/uniswap_bondusdc.json";
import { Result } from "../../components/Result/result";
import { Form } from "../../components/Form/form";
import { StakingContainer } from "./styled";

//defining the addresses at which the contracts are deployed
const BARNBRIDGE_STAKING_ADDR = "0xb0Fa2BeEe3Cf36a7Ac7E99B885b48538Ab364853";
const UNISWAP_BONDUSDC_ADDR = "0x6591c4BcD6D7A1eb4E537DA8B78676C1576Ba244";

//Each Week 20'000 BOND Tokens are issued as rewards
const BOND_ISSUED_YEARLY = 20000 * 52;

export const Staking: React.FC = () => {
  const context = useWeb3Context();
  let [poolValue, setPoolValue] = useState(0);
  const [tokensAmount, setTokensAmount] = useState(0);
  const [bondPrice, setBondPrice] = useState<number>(0);
  const [yearlyReward, setYearlyReward] = useState<number>(0);
  const [apy, setApy] = useState<number>(0);
  const [showData, setShowData] = useState<boolean>(false);

  let uniswap_contract = new context.library.eth.Contract(
    uniswap_bondusdc,
    UNISWAP_BONDUSDC_ADDR
  );
  let barnbridge_contract = new context.library.eth.Contract(
    barnbridge_staking,
    BARNBRIDGE_STAKING_ADDR
  );

  useEffect(() => {
    async function updateState() {
      // The getReserves method returns the amount of BOND tokens and the amount of USDC tokens
      // in the pool
      uniswap_contract.methods
        .getReserves()
        .call((err: any, result: number[]) => {
          // Uniswap liquidity pools have two sides, in this case BOND and USDC, the USD value of the two
          // sides is always equal, so we can get the amount of USDC in the pool and multiply it by 2
          // to get the total USD value of the pool

          let bondReserves = result[0] / 1e18; // adjusting for 18 decimals positions
          let usdcReserves = result[1] / 1e6; // adjusting for 6 decimals positions
          let bondPrice = bondReserves / usdcReserves; // get price of BOND from pool reserves;
          setBondPrice(bondPrice);
          setPoolValue(usdcReserves * 2);
        });

      uniswap_contract.methods
        .totalSupply()
        .call((err: any, result: number) => {
          setTokensAmount(result / 1e18);
        });
    }
    updateState();
  }, []);

  const getData = (userAddress: string) => {
    // We get the amount of LP Tokens the user staked in the barnbridge contract
    barnbridge_contract.methods
      .balanceOf(userAddress, UNISWAP_BONDUSDC_ADDR)
      .call((err: any, result: number) => {
        const liquidityProvidedUSD = BOND_ISSUED_YEARLY / bondPrice;
        const yearlyRewardUsd = poolValue * (result / 1e18 / tokensAmount);
        const apy = (yearlyRewardUsd / liquidityProvidedUSD) * 100;
        setYearlyReward(yearlyRewardUsd);
        setApy(apy);
        setShowData(true);
      });
  };

  return (
    <StakingContainer>
      <Typography variant="h4" textAlign="center">
        Barnbridge
      </Typography>
      {!showData ? (
        <Form getData={getData} />
      ) : (
        <Result
          yearlyReward={yearlyReward}
          apy={apy}
          setShowData={setShowData}
        />
      )}
    </StakingContainer>
  );
};
