import { CoinDetails, CoinMarket } from "./types";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate: 60 },
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getTopCoins(limit = 24): Promise<CoinMarket[]> {
  const query = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(limit),
    page: "1",
    sparkline: "false",
    price_change_percentage: "24h",
  });

  return fetchJson<CoinMarket[]>(`${COINGECKO_BASE_URL}/coins/markets?${query.toString()}`);
}

export async function getCoinDetails(id: string): Promise<CoinDetails> {
  const query = new URLSearchParams({
    localization: "false",
    tickers: "false",
    market_data: "true",
    community_data: "false",
    developer_data: "false",
    sparkline: "false",
  });

  return fetchJson<CoinDetails>(`${COINGECKO_BASE_URL}/coins/${id}?${query.toString()}`);
}