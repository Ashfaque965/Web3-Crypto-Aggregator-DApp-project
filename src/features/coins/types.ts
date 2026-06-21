export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  atl: number;
};

export type CoinDetails = {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_cap_rank: number;
  description: {
    en: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    circulating_supply: number;
    total_supply: number | null;
    ath: {
      usd: number;
    };
    atl: {
      usd: number;
    };
  };
};