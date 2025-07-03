import { erc20Abi } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import { ERC20, ERC20Symbols } from '../contracts';

const useBalances = () => {
  const { address } = useAccount();

  return useReadContracts({
    query: {
      enabled: Boolean(address),
      select: (data) => {
        return Object.values(ERC20).reduce<Record<ERC20Symbols, bigint>>(
          (acc, erc20, idx) => ({
            ...acc,
            [erc20.symbol]: data[idx].result
          }),
          {} as Record<ERC20Symbols, bigint>
        );
      },
      refetchInterval: 60000
    },
    allowFailure: true,
    contracts: Object.values(ERC20).map((erc20) => ({
      address: erc20.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address]
    }))
  });
};

export { useBalances };
