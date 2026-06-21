import { createPublicClient, formatEther, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

export async function getNativeBalance(address: `0x${string}`, chainId: number) {
  const chain = chainId === 11155111 ? sepolia : mainnet;
  const client = createPublicClient({
    chain,
    transport: http(),
  });

  const weiBalance = await client.getBalance({ address });
  return formatEther(weiBalance);
}