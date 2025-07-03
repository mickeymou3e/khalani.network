import { HTMLAttributes, useCallback, useEffect } from 'react';
import './Layout.css';
import { Button, Flex } from '@interlay/ui';
import { useAccount, useConnect, useDisconnect, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { EvmAddressLabel } from './EvmAddressLabel';
import { injected } from 'wagmi/connectors';
import { CONTRACTS } from '../../contracts';
import { useSwitchChain } from 'wagmi';
import { bobSepolia } from '../../wagmi';

type LayoutProps = HTMLAttributes<unknown>;

const Layout = ({ children, ...props }: LayoutProps): JSX.Element => {
  const { address, chain } = useAccount();
  const { connect, isPending: isPendingConnect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  const handleConnect = useCallback(async () => {
    if (address) {
      return disconnect();
    }

    if (chain?.id !== bobSepolia.id) {
      await switchChainAsync({ chainId: bobSepolia.id });
    }
    return connect({ connector: injected() });
  }, [address, chain?.id, connect, disconnect, switchChainAsync]);

  const { data: hash, writeContract, isPending: isMinting } = useWriteContract();

  const { isLoading: isConfirmingMint, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash
  });

  const handleFaucet = () => {
    writeContract({
      abi: CONTRACTS.FAUCET.abi,
      address: CONTRACTS.FAUCET.address,
      functionName: 'mint'
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      alert('Successfully minted tokens');
    }
  }, [isConfirmed]);

  const isLoadintMint = isConfirmingMint || isMinting;

  return (
    <div className='layout' {...props}>
      <header className='header'>
        <Flex gap='md' justifyContent='flex-end'>
          <Button loading={isLoadintMint} onPress={handleFaucet}>
            Get Tokens
          </Button>
          <Button onPress={handleConnect} loading={isPendingConnect}>
            {address ? <EvmAddressLabel address={address} /> : 'Connect Wallet'}
          </Button>
        </Flex>
      </header>
      <main className='main' {...props}>
        {children}
      </main>
    </div>
  );
};

export { Layout };
export type { LayoutProps };
