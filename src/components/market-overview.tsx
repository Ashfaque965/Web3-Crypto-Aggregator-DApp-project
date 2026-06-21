import millify from "millify";
import { CoinMarket } from "@/features/coins/types";

type MarketOverviewProps = {
  coins: CoinMarket[];
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function MarketOverview({ coins }: MarketOverviewProps) {
  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
  const averageDailyChange = average(coins.map((coin) => coin.price_change_percentage_24h));

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <article className="rounded-2xl border border-black/10 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Tracked Assets</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">{coins.length}</p>
      </article>

      <article className="rounded-2xl border border-black/10 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Combined Market Cap</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(totalMarketCap)}</p>
      </article>

      <article className="rounded-2xl border border-black/10 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Combined 24h Volume</p>
        <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(totalVolume)}</p>
        <p className="text-xs text-zinc-500">Avg move {averageDailyChange.toFixed(2)}%</p>
      </article>
    </section>
  );
}