import CoinCard from "@/components/coin-card";
import CoinTable from "@/components/coin-table";
import MarketOverview from "@/components/market-overview";
import Web3ControlPanel from "@/components/web3-control-panel";
import { getTopCoins } from "@/features/coins/api";

export default async function Home() {
  const coins = await getTopCoins(24);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Web3 Crypto Aggregator DApp</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Live Crypto Market Dashboard</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-600">
            Aggregated market snapshots from CoinGecko with responsive cards, table views, and a dedicated detail page for each coin.
          </p>
        </section>

        <MarketOverview coins={coins} />

        <Web3ControlPanel />

        <CoinTable coins={coins} />

        <ul className="grid gap-3 sm:grid-cols-2 md:hidden">
          {coins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </ul>
      </main>
    </div>
  );
}
