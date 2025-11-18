
import React, { useState, useMemo, useEffect } from 'react';
import { User, Currency } from '../types';
import { EXCHANGE_RATES, CURRENCIES } from '../constants';
import { ArrowRightLeftIcon } from './Icons';

interface ExchangeProps {
  user: User;
  onExchange: (fromCurrency: Currency, toCurrency: Currency, fromAmount: number, toAmount: number) => void;
}

const Exchange: React.FC<ExchangeProps> = ({ user, onExchange }) => {
  const [fromCurrency, setFromCurrency] = useState<Currency>(Currency.USD);
  const [toCurrency, setToCurrency] = useState<Currency>(Currency.EUR);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fromAccount = user.accounts.find(acc => acc.currency === fromCurrency);
  
  const conversionRate = useMemo(() => {
    const fromRate = EXCHANGE_RATES[fromCurrency];
    const toRate = EXCHANGE_RATES[toCurrency];
    return toRate / fromRate;
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const amount = parseFloat(fromAmount);
    if (!isNaN(amount) && amount > 0) {
      if (fromAccount && amount > fromAccount.balance) {
        setError('Insufficient funds');
        setToAmount('');
      } else {
        setError('');
        const result = amount * conversionRate;
        setToAmount(result.toFixed(2));
      }
    } else {
      setToAmount('');
       if (fromAmount !== '') setError('');
    }
  }, [fromAmount, conversionRate, fromAccount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
        setFromAmount(value);
    }
  };
  
  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromAmt = parseFloat(fromAmount);
    const toAmt = parseFloat(toAmount);
    if (!error && fromAmt > 0 && toAmt > 0 && fromAccount && fromAmt <= fromAccount.balance) {
      onExchange(fromCurrency, toCurrency, fromAmt, toAmt);
    } else if (fromAmt > fromAccount!.balance) {
        setError('Insufficient funds');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100">Currency Exchange</h1>
      <p className="mt-1 text-slate-400">Select currencies and enter an amount to exchange.</p>
      
      <div className="mt-8 max-w-2xl mx-auto bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* From Currency */}
            <div className="w-full">
              <label htmlFor="from-currency" className="block text-sm font-medium text-slate-300">From</label>
              <div className="mt-1 flex">
                <select
                  id="from-currency"
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value as Currency)}
                  className="w-1/3 appearance-none rounded-l-md px-3 py-3 border border-r-0 border-slate-700 bg-slate-900 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.00"
                  className="w-2/3 appearance-none rounded-r-md px-3 py-3 border border-slate-700 bg-slate-900 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>
              {fromAccount && <p className="text-xs text-slate-400 mt-1">Balance: {fromAccount.balance.toFixed(2)}</p>}
            </div>

            <button type="button" onClick={handleSwapCurrencies} className="p-2 rounded-full bg-slate-700 hover:bg-cyan-600 text-slate-300 hover:text-white transition-colors">
              <ArrowRightLeftIcon className="w-5 h-5" />
            </button>

            {/* To Currency */}
             <div className="w-full">
              <label htmlFor="to-currency" className="block text-sm font-medium text-slate-300">To</label>
              <div className="mt-1 flex">
                <select
                  id="to-currency"
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value as Currency)}
                  className="w-1/3 appearance-none rounded-l-md px-3 py-3 border border-r-0 border-slate-700 bg-slate-900 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  placeholder="0.00"
                  className="w-2/3 appearance-none rounded-r-md px-3 py-3 border border-slate-700 bg-slate-700 placeholder-slate-500 text-slate-300 cursor-not-allowed sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center text-slate-300 h-8 flex items-center justify-center">
            {fromAmount && !error && (
                <p>Rate: 1 {fromCurrency} ≈ {conversionRate.toFixed(4)} {toCurrency}</p>
            )}
            {error && <p className="text-red-400 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!!error || !fromAmount || parseFloat(fromAmount) <= 0}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Confirm Exchange
          </button>
        </form>
      </div>
    </div>
  );
};

export default Exchange;
