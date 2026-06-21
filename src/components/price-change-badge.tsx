type PriceChangeBadgeProps = {
  value: number;
};

export default function PriceChangeBadge({ value }: PriceChangeBadgeProps) {
  const isPositive = value >= 0;
  const formatted = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700"
      }`}
    >
      {formatted}
    </span>
  );
}