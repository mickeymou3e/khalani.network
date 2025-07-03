/* eslint-disable react-refresh/only-export-components */
import { useAccount, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useCallback, useEffect, useMemo } from 'react';
import { Address, erc20Abi } from 'viem';

import { useTokenAllowance } from './useTokenAlowance';

const UINT_256_MAX = BigInt(2 ** 256) - BigInt(1);

const useGetApprovalData = (token: Address | undefined, spender?: Address) => {
  const { address } = useAccount();
  const { allowance, refetch } = useTokenAllowance({
    token: token,
    owner: address,
    spender
  });

  const isApproveRequired = useMemo((): boolean => {
    return !!token && allowance !== undefined && allowance <= 0n;
  }, [allowance, token]);

  return {
    isApproveRequired,
    allowance,
    refetch
  };
};

type UseApprovalProps = {
  token: Address | undefined;
  spender?: Address;
  onApprovalSuccess?: () => void;
};

const useApproval = ({ token, spender, onApprovalSuccess }: UseApprovalProps) => {
  const { address } = useAccount();

  const { isApproveRequired, allowance, refetch } = useGetApprovalData(token, spender);

  const { data: approveSimulate } = useSimulateContract({
    query: {
      enabled: Boolean(address && token && spender && isApproveRequired)
    },
    address: token,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender!, UINT_256_MAX]
  });

  const {
    data: approveResult,
    writeContractAsync: approveFnAsync,
    writeContract: approveFn,
    isPending: isSigningApprove
  } = useWriteContract();

  const approve = useCallback(() => {
    if (approveSimulate?.request) {
      return approveFn(approveSimulate.request);
    } else {
      throw new Error('Approve simulation failed');
    }
  }, [approveSimulate, approveFn]);

  const approveAsync = useCallback(() => {
    if (approveSimulate?.request) {
      return approveFnAsync(approveSimulate.request);
    } else {
      throw new Error('Approve simulation failed');
    }
  }, [approveSimulate, approveFnAsync]);

  const { isLoading: isApproving, isSuccess: isApproveSuccessful } = useWaitForTransactionReceipt({
    hash: approveResult ? approveResult : undefined
  });

  useEffect(() => {
    if (isApproveSuccessful) {
      onApprovalSuccess?.();
      refetch();
    }
  }, [isApproveSuccessful, onApprovalSuccess, refetch]);

  return {
    refetch,
    isApproveRequired,
    isSigningApprove,
    isApproving: isApproving || isSigningApprove,
    allowance,
    approveAsync,
    approve
  };
};

export { useApproval };
export type { UseApprovalProps };
