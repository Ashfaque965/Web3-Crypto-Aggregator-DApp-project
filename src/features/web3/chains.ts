export type SupportedChain = {
  id: number;
  name: string;
  rpcUrl: string;
  nativeCurrency: string;
};

export const supportedChains: SupportedChain[] = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
    nativeCurrency: "ETH",
  },
  {
    id: 11155111,
    name: "Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    nativeCurrency: "ETH",
  },
];

export const defaultChain = supportedChains[0];

export function getChainById(chainId: number) {
  return supportedChains.find((chain) => chain.id === chainId) ?? null;
}

export function toHexChainId(chainId: number) {
  return `0x${chainId.toString(16)}`;
}