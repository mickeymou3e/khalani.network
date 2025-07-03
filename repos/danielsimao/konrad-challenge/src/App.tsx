/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, H1, TokenData, TokenInput } from '@interlay/ui';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useAccount, useCall, useReadContract, useSwitchChain, useWriteContract } from 'wagmi';
import './App.css';
import { Layout } from './components';
import { CONTRACTS, ERC20, ERC20List, ERC20Symbols } from './contracts';
import { useApproval, useBalances } from './hooks';
// TODO: util toAtomicAmount is available for contract interactions
import { toHumanAmount, toAtomicAmount } from './utils';
import { bobSepolia } from './wagmi';
import { usePublicClient } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';

type Order = {
  id: bigint;
  offeringAmount: bigint;
  offeringToken: Address;
  askingAmount: bigint;
  askingToken: Address;
  requesterAddress: Address;
};

// TODO: to be used
const mockOrders: Order[] = [
  {
    id: 1n,
    offeringAmount: 1000000000n,
    askingAmount: 10000000n,
    askingToken: ERC20.USDC.address,
    offeringToken: ERC20.WBTC.address,
    requesterAddress: '0x0'
  },
  {
    id: 2n,
    offeringAmount: 1000000n,
    askingAmount: 100000000000n,
    offeringToken: ERC20.USDC.address,
    askingToken: ERC20.WBTC.address,
    requesterAddress: '0x0'
  },
  {
    id: 3n,
    offeringAmount: 10000000n,
    askingAmount: 100000000000n,
    askingToken: ERC20.USDC.address,
    offeringToken: ERC20.WBTC.address,
    requesterAddress: '0x0'
  }
];

// MEMO: used in the TokenInput
const tokenInputItems: TokenData[] = ERC20List.map((erc20) => ({
  balance: 0,
  balanceUSD: 0,
  currency: erc20,
  logoUrl: erc20.logoUrl
}));

function App() {
  const publicClient = usePublicClient();
  const { data: balances } = useBalances();
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { writeContractAsync } = useWriteContract();

  const [offeringAmount, setOfferingAmount] = useState<string>('');
  const [offeringToken, setOfferingToken] = useState<string>(ERC20.WBTC.symbol);

  const [askingAmount, setAskingAmount] = useState<string>('');
  const [askingToken, setAskingToken] = useState<string>(ERC20.USDC.symbol);

  useEffect(() => {
    if (isConnected && (!chainId || chainId !== bobSepolia.id)) {
      switchChain({ chainId: bobSepolia.id });
    }
  }, [chainId, isConnected, switchChain]);

  const { isApproveRequired, approveAsync, isApproving } = useApproval({
    token: ERC20[offeringToken as ERC20Symbols].address,
    spender: CONTRACTS.MARKETPLACE.address
  });

  // TODO: to be used
  const handleApproval = useCallback(async () => {
    if (!isApproveRequired) return;

    const hash = await approveAsync();
    const result = await publicClient.waitForTransactionReceipt({ hash });

    if (result.status === 'reverted') {
      throw new Error('Failed Approve');
    }
  }, [approveAsync, isApproveRequired, publicClient]);

  // TODO: to be implemented
  const offerBalance = useMemo(
    () => toHumanAmount(balances?.[ERC20.USDC.symbol] || 0n, ERC20.USDC.decimals),
    [balances]
  );

  const isDisabled = !isConnected;
  const isLoading = isApproving;

  // const formattedOfferingAmount = toHumanAmount(offeringAmount, )

  const handleOfferingSelectionChange = (key: Key) => {
    const symbol = key as ERC20Symbols;
    console.log(symbol, askingToken);
    if (symbol === askingToken) {
      setOfferingToken(askingToken);
      setAskingToken(offeringToken);
      return;
    }
    setOfferingToken(symbol);
    console.log('Offering symbol: ', symbol);
  };

  const handleAskingSelectionChange = (key: Key) => {
    const symbol = key as ERC20Symbols;
    setAskingToken(symbol);
    console.log('Asking symbol: ', symbol);
  };

  const handleFormSubmit = useCallback(async () => {
    await handleApproval();

    const offeringTokenDetails = ERC20[offeringToken];
    const askingTokenDetails = ERC20[askingToken];

    const hash = await writeContractAsync({
      address: CONTRACTS.MARKETPLACE.address as Address,
      abi: CONTRACTS.MARKETPLACE.abi,
      functionName: 'placeErcErcOrder',
      args: [
        offeringTokenDetails.address,
        toAtomicAmount(offeringAmount, offeringTokenDetails.decimals),
        askingTokenDetails.address,
        toAtomicAmount(askingAmount, askingTokenDetails.decimals)
      ]
    });
    await waitForTransactionReceipt({ hash });
  }, [isApproveRequired, offeringToken, offeringAmount, askingToken, askingAmount]);

  const { data: openOrders } = useReadContract({
    address: CONTRACTS.MARKETPLACE.address as Address,
    abi: CONTRACTS.MARKETPLACE.abi,
    functionName: 'getOpenOrders'
  });

  const formattedOpenOrders = useMemo(() => {
    const [orders, ids] = openOrders;

    return orders.map((order: any, index: number) => ({
      ...order,
      id: ids[index]
    }));
  }, [openOrders]);

  return (
    <Layout>
      <Card gap='2xl' className='form-card'>
        {formattedOpenOrders.map((order) => (
          <ul>
            <li>{order.askingAmount.toString()}</li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        ))}
      </Card>
      <div className='form-card-section'>
        <Card gap='2xl' className='form-card'>
          <H1 size='xl' weight='bold'>
            Open Order
          </H1>
          {/* MEMO: amount and currency input for what the user is offering */}
          <TokenInput
            type='selectable'
            valueUSD={0}
            items={tokenInputItems}
            balance={offerBalance}
            // TODO: value and onChange to be implemented
            value={offeringAmount}
            onChange={(event) => setOfferingAmount(event.target.value)}
            selectProps={{
              // TODO: value and onSelectionChange to be implemented
              value: offeringToken,
              onSelectionChange: (key: Key) => handleOfferingSelectionChange(key)
            }}
          />
          {/* MEMO: amount and currency input for what the user is asking */}
          <TokenInput
            type='selectable'
            valueUSD={0}
            items={tokenInputItems}
            // TODO: value and onChange to be implemented
            value={askingAmount}
            onChange={(event) => setAskingAmount(event.target.value)}
            selectProps={{
              // TODO: value and onSelectionChange to be implemented
              value: askingToken,
              onSelectionChange: (key: Key) => handleAskingSelectionChange(key)
            }}
          />
          <Button
            size='xl'
            color='primary'
            loading={isLoading}
            type='submit'
            disabled={isDisabled}
            onClick={handleFormSubmit}
          >
            {isApproveRequired ? 'Approve' : 'Create Order'}
          </Button>
        </Card>
      </div>
    </Layout>
  );
}

export default App;
