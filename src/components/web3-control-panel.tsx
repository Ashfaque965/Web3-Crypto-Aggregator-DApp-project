"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultChain, supportedChains } from "@/features/web3/chains";
import { signInvestmentIntent } from "@/features/web3/signing";
import { connectWallet, onWalletEvents, switchToChain, WalletSession } from "@/features/web3/wallet";

type SyncResponse = {
  state: {
    nativeBalance: string;
    lastSyncedAt: number;
  };
};

export default function Web3ControlPanel() {
  const [walletSession, setWalletSession] = useState<WalletSession | null>(null);
  const [statusMessage, setStatusMessage] = useState("Disconnected");
  const [signedIntent, setSignedIntent] = useState<string | null>(null);
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [selectedChainId, setSelectedChainId] = useState(defaultChain.id);

  useEffect(() => {
    return onWalletEvents({
      onAccountsChanged: (accounts) => {
        if (accounts.length === 0) {
          setWalletSession(null);
          setStatusMessage("Wallet disconnected.");
          return;
        }

        setWalletSession((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            address: accounts[0],
          };
        });
      },
      onChainChanged: (chainHexId) => {
        const parsedChainId = Number.parseInt(chainHexId, 16);
        setSelectedChainId(parsedChainId);
        setWalletSession((previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            chainId: parsedChainId,
          };
        });
      },
    });
  }, []);

  const shortAddress = useMemo(() => {
    if (!walletSession?.address) return "";
    return `${walletSession.address.slice(0, 6)}...${walletSession.address.slice(-4)}`;
  }, [walletSession?.address]);

  async function handleConnect() {
    try {
      const session = await connectWallet();
      setWalletSession(session);
      setSelectedChainId(session.chainId);
      setStatusMessage(`Connected: ${session.address.slice(0, 6)}...`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to connect wallet.");
    }
  }

  async function handleSwitchChain() {
    try {
      await switchToChain(selectedChainId);
      setStatusMessage(`Switched to chain ${selectedChainId}.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Failed to switch network.");
    }
  }

  async function handleSignIntent() {
    try {
      const intent = await signInvestmentIntent("Authorize secure portfolio refresh");
      setSignedIntent(intent.signature);
      setStatusMessage("Signed intent created.");

      await fetch("/api/web3/tx", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(intent),
      });
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Signing failed.");
    }
  }

  async function handleSync() {
    if (!walletSession) {
      setStatusMessage("Connect wallet first.");
      return;
    }

    try {
      const response = await fetch("/api/web3/sync", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          address: walletSession.address,
          chainId: walletSession.chainId,
        }),
      });

      if (!response.ok) {
        throw new Error("Sync API rejected request.");
      }

      const data = (await response.json()) as SyncResponse;
      setNativeBalance(data.state.nativeBalance);
      setStatusMessage("On-chain/off-chain sync completed.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Sync failed.");
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Web3 Control Center</p>
          <h2 className="mt-1 text-xl font-bold text-zinc-900">Wallet, Signing, and Sync</h2>
          <p className="mt-2 text-sm text-zinc-600">Security-first integration layer for wallet sessions, signed intents, and on-chain balance reconciliation.</p>
        </div>
        <button
          type="button"
          onClick={handleConnect}
          className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          {walletSession ? "Reconnect Wallet" : "Connect Wallet"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-black/10 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Address</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{shortAddress || "Not connected"}</p>
        </article>
        <article className="rounded-xl border border-black/10 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Chain ID</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{walletSession?.chainId ?? "-"}</p>
        </article>
        <article className="rounded-xl border border-black/10 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Native Balance</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{nativeBalance ? `${nativeBalance} ETH` : "Not synced"}</p>
        </article>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          className="rounded-xl border border-black/20 bg-white px-3 py-2 text-sm"
          value={selectedChainId}
          onChange={(event) => setSelectedChainId(Number(event.target.value))}
        >
          {supportedChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleSwitchChain} className="rounded-xl border border-black/20 px-3 py-2 text-sm font-medium hover:bg-zinc-100">
          Switch Chain
        </button>
        <button type="button" onClick={handleSignIntent} className="rounded-xl border border-black/20 px-3 py-2 text-sm font-medium hover:bg-zinc-100">
          Sign Intent + Relay
        </button>
        <button type="button" onClick={handleSync} className="rounded-xl border border-black/20 px-3 py-2 text-sm font-medium hover:bg-zinc-100">
          Sync On/Off Chain
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-600">Status: {statusMessage}</p>
      {signedIntent ? <p className="mt-1 break-all text-xs text-zinc-500">Last Signature: {signedIntent}</p> : null}
    </section>
  );
}