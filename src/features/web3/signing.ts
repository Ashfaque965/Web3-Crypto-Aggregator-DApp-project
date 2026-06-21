import { BrowserProvider } from "ethers";

export type SignedIntent = {
  account: string;
  message: string;
  signature: string;
  issuedAt: number;
};

export async function signInvestmentIntent(message: string): Promise<SignedIntent> {
  if (!window.ethereum) {
    throw new Error("Wallet provider unavailable.");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const account = await signer.getAddress();

  const payload = `${message}\nnonce:${crypto.randomUUID()}\ntime:${Date.now()}`;
  const signature = await signer.signMessage(payload);

  return {
    account,
    message: payload,
    signature,
    issuedAt: Date.now(),
  };
}