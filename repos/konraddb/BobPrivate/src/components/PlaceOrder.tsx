import React from 'react';
import { useWriteContract } from 'wagmi';
import { marketplaceAbi } from '../abis/marketplace';
import { erc20Abi } from '../abis/erc20';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '../wagmi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contractAddress } from '../config';

const PlaceOrder: React.FC = () => {
  const { data: hash, writeContractAsync } = useWriteContract();

  const approveMutation = useMutation({
    mutationFn: async (args: any) => {
      const hash = await (writeContractAsync as any)(args);
      await waitForTransactionReceipt(config, { hash });
      return hash;
    },
    onSuccess: (data) => {
      console.log('Approval successful', data);
    },
    onError: (error) => {
      console.log('Approval failed', error);
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (args: any) => {
      const hash = await (writeContractAsync as any)(args);
      await waitForTransactionReceipt(config, { hash });
      return hash;
    },
    onSuccess: (data) => {
      console.log('Order placed with data', data);
    },
    onError: (error) => {
      console.log('Error when placing data', error);
    },
  });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sellingToken = formData.get('sellingToken') as string;
    const saleAmount = formData.get('saleAmount') as string;
    const buyingToken = formData.get('buyingToken') as string;
    const buyAmount = formData.get('buyAmount') as string;

    const saleAmountBigInt = BigInt(saleAmount);
    const buyAmountBigInt = BigInt(buyAmount);

    try {
      await approveMutation.mutateAsync({
        address: sellingToken,
        abi: erc20Abi,
        functionName: 'approve',
        args: [contractAddress, saleAmountBigInt],
      });
      // const hash = await (writeContractAsync as any)({
      //   address: sellingToken,
      //   abi: erc20Abi,
      //   functionName: 'approve',
      //   args: ['0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C', saleAmountBigInt],
      // });

      // await waitForTransactionReceipt(config, { hash });

      await placeOrderMutation.mutateAsync({
        address: contractAddress,
        abi: marketplaceAbi,
        functionName: 'placeErcErcOrder',
        args: [sellingToken, saleAmountBigInt, buyingToken, buyAmountBigInt],
      });

      // await (writeContractAsync as any)({
      //   address: '0xE0Fd942cEa2f2e56f26AAC279F8D0F280bF52d7C',
      //   abi: marketplaceAbi,
      //   functionName: 'placeErcErcOrder',
      //   args: [sellingToken, saleAmountBigInt, buyingToken, buyAmountBigInt],
      // });
    } catch (error) {
      console.error('Contract execution failed:', error);
    }
  }

  return (
    <form onSubmit={submit}>
      <input name="sellingToken" placeholder="0xA0Cf…251e" required />
      <input name="saleAmount" placeholder="0.05" required />
      <input name="buyingToken" placeholder="0xA0Cf…251e" required />
      <input name="buyAmount" placeholder="0.05" required />
      <button type="submit">Place order</button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </form>
  );
};

export default PlaceOrder;
