import { useMemo } from 'react';
import { Address, erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

type UseTokenAllowanceProps = {
  token?: Address;
  owner?: Address;
  spender?: Address;
};

const useTokenAllowance = ({ token, owner, spender }: UseTokenAllowanceProps) => {
  const inputs = useMemo(() => [owner, spender] as [Address, Address], [owner, spender]);

  const { data: allowance, ...rest } = useReadContract({
    query: {
      enabled: Boolean(spender && owner && token)
    },
    abi: erc20Abi,
    address: token,
    functionName: 'allowance',
    args: inputs
  });

  return useMemo(
    () => ({
      allowance: token && typeof allowance !== 'undefined' ? allowance : undefined,
      ...rest
    }),
    [token, rest, allowance]
  );
};

export { useTokenAllowance };
