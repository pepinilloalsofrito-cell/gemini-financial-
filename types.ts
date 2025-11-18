
export interface Account {
  currency: Currency;
  balance: number;
  symbol: string;
}

export enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  BNB = 'BNB',
  SOL = 'SOL',
  XRP = 'XRP',
  USDC = 'USDC',
  ADA = 'ADA',
  AVAX = 'AVAX',
  DOGE = 'DOGE',
}

export type CryptoPrices = Record<CryptoCurrency, number>;

export interface CryptoAccount {
  currency: CryptoCurrency;
  name: string;
  symbol: string;
  balance: number;
}

export interface User {
  name: string;
  accounts: Account[];
  cryptoAccounts: CryptoAccount[];
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  JPY = 'JPY',
  GBP = 'GBP',
}

export type ExchangeRates = {
  [key in Currency]: number; // Rate relative to USD
};

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
