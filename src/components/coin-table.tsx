import millify from "millify";
import Image from "next/image";
import Link from "next/link";
import { CoinMarket } from "@/features/coins/types";
import PriceChangeBadge from "./price-change-badge";

type CoinTableProps = {
  coins: CoinMarket[];
};

export default function CoinTable({ coins }: CoinTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white md:block">
      <table className="min-w-full divide-y divide-black/10">
        <thead className="bg-zinc-50">
          <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3">Coin</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">24h</th>
            <th className="px-4 py-3">Market Cap</th>
            <th className="px-4 py-3">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">
                <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} />
                  <div>
                    <p className="font-medium text-zinc-900">{coin.name}</p>
                    <p className="text-xs uppercase text-zinc-500">{coin.symbol}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3 font-semibold text-zinc-900">${millify(coin.current_price)}</td>
              <td className="px-4 py-3">
                <PriceChangeBadge value={coin.price_change_percentage_24h} />
              </td>
              <td className="px-4 py-3 text-zinc-700">${millify(coin.market_cap)}</td>
              <td className="px-4 py-3 text-zinc-700">${millify(coin.total_volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}