
import React, { useState, useCallback, useEffect } from 'react';
import { User, Currency, CryptoCurrency, CryptoPrices } from './types';
import { INITIAL_USER, EXCHANGE_RATES, INITIAL_CRYPTO_PRICES } from './constants';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Exchange from './components/Exchange';
import CryptoView from './components/CryptoView';
import Chatbot from './components/Chatbot';

type View = 'dashboard' | 'exchange' | 'crypto';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices>(INITIAL_CRYPTO_PRICES);

  const handleLogin = useCallback(() => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  }, []);

  // Simulate crypto price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prevPrices => {
        const newPrices = { ...prevPrices };
        (Object.keys(newPrices) as CryptoCurrency[]).forEach(key => {
          // Simulate random fluctuation between -1% and +1%
          const volatility = 0.01;
          const change = 1 + (Math.random() * volatility * 2 - volatility);
          newPrices[key] = newPrices[key] * change;
        });
        return newPrices;
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleExchange = useCallback((fromCurrency: Currency, toCurrency: Currency, fromAmount: number, toAmount: number) => {
    if (!user) return;

    const updatedAccounts = user.accounts.map(account => {
      if (account.currency === fromCurrency) {
        return { ...account, balance: account.balance - fromAmount };
      }
      if (account.currency === toCurrency) {
        return { ...account, balance: account.balance + toAmount };
      }
      return account;
    });

    setUser({ ...user, accounts: updatedAccounts });
    setCurrentView('dashboard');
  }, [user]);

  const handleCryptoTrade = useCallback((crypto: CryptoCurrency, type: 'buy' | 'sell', amountUSD: number) => {
      if (!user) return;

      const cryptoPrice = cryptoPrices[crypto];
      const cryptoAmount = amountUSD / cryptoPrice;

      // Update Fiat (USD) Balance
      const updatedAccounts = user.accounts.map(acc => {
          if (acc.currency === Currency.USD) {
              return { 
                  ...acc, 
                  balance: type === 'buy' ? acc.balance - amountUSD : acc.balance + amountUSD 
              };
          }
          return acc;
      });

      // Update Crypto Balance
      const updatedCryptoAccounts = user.cryptoAccounts.map(acc => {
          if (acc.currency === crypto) {
              return {
                  ...acc,
                  balance: type === 'buy' ? acc.balance + cryptoAmount : acc.balance - cryptoAmount
              };
          }
          return acc;
      });

      setUser({
          ...user,
          accounts: updatedAccounts,
          cryptoAccounts: updatedCryptoAccounts
      });
  }, [user, cryptoPrices]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header user={user} onNavigate={handleNavigate} onLogout={handleLogout} activeView={currentView} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {currentView === 'dashboard' && <Dashboard user={user} cryptoPrices={cryptoPrices} onNavigate={handleNavigate}/>}
        {currentView === 'exchange' && <Exchange user={user} onExchange={handleExchange} />}
        {currentView === 'crypto' && <CryptoView user={user} cryptoPrices={cryptoPrices} onTrade={handleCryptoTrade} />}
      </main>
      <Chatbot />
    </div>
  );
}
