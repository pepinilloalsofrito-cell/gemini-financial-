
import { User, Currency, ExchangeRates, CryptoCurrency, CryptoPrices } from './types';

export const INITIAL_USER: User = {
  name: 'Alex Doe',
  accounts: [
    { currency: Currency.USD, balance: 15000.75, symbol: '$' },
    { currency: Currency.EUR, balance: 8500.50, symbol: '€' },
    { currency: Currency.JPY, balance: 1250000, symbol: '¥' },
    { currency: Currency.GBP, balance: 5000.25, symbol: '£' },
  ],
  cryptoAccounts: [
    { currency: CryptoCurrency.BTC, name: 'Bitcoin', symbol: 'BTC', balance: 0.05 },
    { currency: CryptoCurrency.ETH, name: 'Ethereum', symbol: 'ETH', balance: 0 },
    { currency: CryptoCurrency.USDT, name: 'Tether', symbol: 'USDT', balance: 0 },
    { currency: CryptoCurrency.BNB, name: 'BNB', symbol: 'BNB', balance: 0 },
    { currency: CryptoCurrency.SOL, name: 'Solana', symbol: 'SOL', balance: 0 },
    { currency: CryptoCurrency.XRP, name: 'XRP', symbol: 'XRP', balance: 0 },
    { currency: CryptoCurrency.USDC, name: 'USDC', symbol: 'USDC', balance: 0 },
    { currency: CryptoCurrency.ADA, name: 'Cardano', symbol: 'ADA', balance: 0 },
    { currency: CryptoCurrency.AVAX, name: 'Avalanche', symbol: 'AVAX', balance: 0 },
    { currency: CryptoCurrency.DOGE, name: 'Dogecoin', symbol: 'DOGE', balance: 0 },
  ]
};

// Rates relative to 1 USD. e.g., 1 USD = 0.92 EUR
export const EXCHANGE_RATES: ExchangeRates = {
  [Currency.USD]: 1,
  [Currency.EUR]: 0.92,
  [Currency.GBP]: 0.79,
  [Currency.JPY]: 157.0,
};

export const CURRENCIES: Currency[] = Object.values(Currency);

// Approximated current market prices
export const INITIAL_CRYPTO_PRICES: CryptoPrices = {
    [CryptoCurrency.BTC]: 97540.50,
    [CryptoCurrency.ETH]: 3650.20,
    [CryptoCurrency.USDT]: 1.00,
    [CryptoCurrency.BNB]: 720.10,
    [CryptoCurrency.SOL]: 245.80,
    [CryptoCurrency.XRP]: 2.45,
    [CryptoCurrency.USDC]: 1.00,
    [CryptoCurrency.ADA]: 1.15,
    [CryptoCurrency.AVAX]: 48.20,
    [CryptoCurrency.DOGE]: 0.42,
};
