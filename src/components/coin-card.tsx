"use client";

import { motion } from "framer-motion";
import millify from "millify";
import Image from "next/image";
import Link from "next/link";
import { CoinMarket } from "@/features/coins/types";
import PriceChangeBadge from "./price-change-badge";

type CoinCardProps = {
  coin: CoinMarket;
};

export default function CoinCard({ coin }: CoinCardProps) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Link
        href={`/coins/${coin.id}`}
        className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md"
      >
        <div className="mb-3 flex items-center gap-3">
          <Image src={coin.image} alt={coin.name} width={32} height={32} />
          <div>
            <p className="text-sm font-medium text-zinc-500">#{coin.market_cap_rank}</p>
            <h3 className="text-base font-semibold text-zinc-900">{coin.name}</h3>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <p className="text-2xl font-bold text-zinc-950">${millify(coin.current_price)}</p>
          <div className="flex items-center justify-between">
            <PriceChangeBadge value={coin.price_change_percentage_24h} />
            <p className="text-xs text-zinc-500">Vol ${millify(coin.total_volume)}</p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}