import { BrowserProvider } from "ethers";
import { getChainById, toHexChainId } from "./chains";

export type WalletSession = {
  address: string;
  chainId: number;
};

function assertEthereumProvider(): NonNullable<Window["ethereum"]> {
  if (!window.ethereum) {
    throw new Error("No injected wallet found. Install MetaMask or another EVM wallet.");
  }

  return window.ethereum;
}

export async function connectWallet(): Promise<WalletSession> {
  const ethereumProvider = assertEthereumProvider();
  const provider = new BrowserProvider(ethereumProvider);

  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();

  return {
    address: await signer.getAddress(),
    chainId: Number(network.chainId),
  };
}

export async function switchToChain(chainId: number): Promise<void> {
  const ethereumProvider = assertEthereumProvider();
  const chain = getChainById(chainId);

  if (!chain) {
    throw new Error("Requested chain is not supported.");
  }

  try {
    await ethereumProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHexChainId(chainId) }],
    });
  } catch {
    await ethereumProvider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: toHexChainId(chain.id),
          chainName: chain.name,
          nativeCurrency: {
            name: chain.nativeCurrency,
            symbol: chain.nativeCurrency,
            decimals: 18,
          },
          rpcUrls: [chain.rpcUrl],
        },
      ],
    });
  }
}

export function onWalletEvents(handlers: {
  onAccountsChanged: (accounts: string[]) => void;
  onChainChanged: (chainHexId: string) => void;
}) {
  if (!window.ethereum) {
    return () => undefined;
  }

  const accountsChangedListener = (...args: unknown[]) => {
    const firstArgument = args[0];
    handlers.onAccountsChanged(Array.isArray(firstArgument) ? (firstArgument as string[]) : []);
  };

  const chainChangedListener = (...args: unknown[]) => {
    const firstArgument = args[0];
    handlers.onChainChanged(typeof firstArgument === "string" ? firstArgument : "0x1");
  };

  window.ethereum.on("accountsChanged", accountsChangedListener);
  window.ethereum.on("chainChanged", chainChangedListener);

  return () => {
    window.ethereum?.removeListener("accountsChanged", accountsChangedListener);
    window.ethereum?.removeListener("chainChanged", chainChangedListener);
  };
}