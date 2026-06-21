import millify from "millify";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PriceChangeBadge from "@/components/price-change-badge";
import { getCoinDetails } from "@/features/coins/api";

type CoinDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function summaryFromDescription(text: string): string {
  const cleanText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!cleanText) return "No coin summary available.";
  return `${cleanText.slice(0, 280)}${cleanText.length > 280 ? "..." : ""}`;
}

export default async function CoinDetailsPage({ params }: CoinDetailsPageProps) {
  const { id } = await params;
  const coin = await getCoinDetails(id).catch(() => null);

  if (!coin) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-8 md:px-8">
        <Link href="/" className="w-fit text-sm font-medium text-zinc-600 hover:text-zinc-900">
          ← Back to market
        </Link>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center gap-4">
            <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
            <div>
              <p className="text-sm text-zinc-500">Rank #{coin.market_cap_rank}</p>
              <h1 className="text-3xl font-bold text-zinc-950">{coin.name}</h1>
              <p className="text-sm uppercase tracking-wide text-zinc-500">{coin.symbol}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold text-zinc-950">${millify(coin.market_data.current_price.usd)}</p>
            <PriceChangeBadge value={coin.market_data.price_change_percentage_24h} />
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-700">{summaryFromDescription(coin.description.en)}</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Market Cap</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(coin.market_data.market_cap.usd)}</p>
          </article>

          <article className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">24h Volume</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(coin.market_data.total_volume.usd)}</p>
          </article>

          <article className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">All-Time High</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(coin.market_data.ath.usd)}</p>
          </article>

          <article className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">All-Time Low</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">${millify(coin.market_data.atl.usd)}</p>
          </article>
        </section>
      </main>
    </div>
  );
}