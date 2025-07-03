import React, { useEffect, useMemo } from 'react';
import {
  useBlockNumber,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { marketplaceAbi } from '../abis/marketplace';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import { erc20Abi } from '../abis/erc20';
import { StyledContainer } from '../styles/Orders.styles';
import { contractAddress } from '../config';

const Orders: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  // const {
  //   data: openOrders,
  //   error,
  //   isLoading,
  //   queryKey,
  // } = (useReadContract as any)({
  //   address: '0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C',
  //   abi: marketplaceAbi,
  //   functionName: 'getOpenOrders',
  // });

  const {
    data: openOrders,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['openOrders', blockNumber ? blockNumber.toString() : ''],
    queryFn: async () => {
      const orders = await (readContract as any)(config, {
        address: contractAddress,
        abi: marketplaceAbi,
        functionName: 'getOpenOrders',
      });
      return orders as any[];
    },
    enabled: !!blockNumber,
  });

  // useEffect(() => {
  //   if (blockNumber !== undefined) {
  //     queryClient.invalidateQueries({ queryKey: ['openOrders'] });
  //   }
  // }, [blockNumber, queryClient]);

  const { writeContractAsync } = useWriteContract();

  const acceptOrderMutation = useMutation({
    mutationFn: async (args: any) => {
      const hash = await (writeContractAsync as any)(args);
      await waitForTransactionReceipt(config, { hash });
      return hash;
    },
    onSuccess: (data) => {
      console.log('Order accepted with data', data);
    },
    onError: (error) => {
      console.log('Error when accepting order', error);
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (args: any) => {
      const hash = await (writeContractAsync as any)(args);
      await waitForTransactionReceipt(config, { hash });
      return hash;
    },
    onSuccess: (data) => {
      console.log('Approved token with data', data);
    },
    onError: (error) => {
      console.log('Error when approving tokens', error);
    },
  });

  const acceptOrder = async (
    key: bigint,
    saleAmount: bigint,
    sellingToken: string,
  ) => {
    await approveMutation.mutateAsync({
      address: sellingToken,
      abi: erc20Abi,
      functionName: 'approve',
      args: [contractAddress, saleAmount],
    });
    await acceptOrderMutation.mutateAsync({
      address: '0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C',
      abi: marketplaceAbi,
      functionName: 'acceptErcErcOrder',
      args: [key, saleAmount],
    });
  };

  const withdrawOrder = async (key: bigint) => {
    const hash = await (writeContractAsync as any)({
      address: '0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C',
      abi: marketplaceAbi,
      functionName: 'withdrawErcErcOrder',
      args: [key],
    });
    await waitForTransactionReceipt(config, { hash });
  };

  const formattedOrders = useMemo(() => {
    if (!openOrders) return [];
    const [orders, keys] = openOrders;
    return orders
      .map((order: any, index: number) => ({
        ...order,
        id: keys[index],
      }))
      .reverse();
  }, [openOrders]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!openOrders) {
    return <div>No open orders available.</div>;
  }

  return (
    <StyledContainer>
      {isLoading && <div>Loading</div>}
      <h2>Open Orders</h2>
      {formattedOrders.map((order: any) => (
        <ul key={order.id}>
          <li>Asking amount: {order.askingAmount.toString()}</li>
          <li>Asking token: {order.askingToken}</li>
          <li>Offering token: {order.offeringToken}</li>
          <li>Offering amount: {order.offeringAmount.toString()}</li>
          <li>
            <button
              onClick={() =>
                acceptOrder(order.id, order.offeringAmount, order.offeringToken)
              }
            >
              Accept
            </button>
            <button onClick={() => withdrawOrder(order.id)}>Withdraw</button>
          </li>
        </ul>
      ))}
    </StyledContainer>
  );
};

export default Orders;
