import Web3 from 'web3';

/**
 * Fetches the current ETH balance of an Ethereum `address` on chain referenced by RPC provider `rpcUrl`.
 * @return balance denominated in ETH, e.g. `0.3` ETH, `0.04231` ETH
 */
export async function getEthBalance(address: string, rpcUrl: string): Promise<number> {
  const web3 = new Web3(rpcUrl);
  const balanceWei = await web3.eth.getBalance(address);
  return parseFloat(web3.utils.fromWei(balanceWei, 'ether'));
}