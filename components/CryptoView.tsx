
import React, { useState } from 'react';
import { User, CryptoCurrency, Currency, CryptoPrices } from '../types';
import { TrendingUpIcon } from './Icons';

interface CryptoViewProps {
  user: User;
  cryptoPrices: CryptoPrices;
  onTrade: (crypto: CryptoCurrency, type: 'buy' | 'sell', amountUSD: number) => void;
}

const CryptoView: React.FC<CryptoViewProps> = ({ user, cryptoPrices, onTrade }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTradeClick = (crypto: CryptoCurrency, type: 'buy' | 'sell') => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setAmountUSD('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrypto) return;
    
    const val = parseFloat(amountUSD);
    const usdAccount = user.accounts.find(a => a.currency === Currency.USD);
    const cryptoAccount = user.cryptoAccounts.find(a => a.currency === selectedCrypto);
    const cryptoPrice = cryptoPrices[selectedCrypto];

    if (val <= 0 || isNaN(val)) {
        setError("Please enter a valid amount.");
        return;
    }

    if (tradeType === 'buy') {
        if (!usdAccount || usdAccount.balance < val) {
            setError("Insufficient USD balance.");
            return;
        }
    } else {
        // Sell logic: val is Amount in USD worth of crypto we want to sell
        // Check if user has enough crypto for this USD amount
        const cryptoAmountToSell = val / cryptoPrice;
        if (!cryptoAccount || cryptoAccount.balance < cryptoAmountToSell) {
            setError(`Insufficient ${selectedCrypto} balance.`);
            return;
        }
    }

    onTrade(selectedCrypto, tradeType, val);
    setSelectedCrypto(null);
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUpIcon className="h-8 w-8 text-purple-400" />
            Crypto Market
        </h1>
        <p className="mt-1 text-slate-400">Invest in the top cryptocurrencies using your USD balance. Prices update in real-time.</p>
      </div>

      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Price (USD)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Your Balance</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {user.cryptoAccounts.map((account) => {
                const price = cryptoPrices[account.currency];
                return (
                  <tr key={account.currency} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-300">
                            {account.symbol[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">{account.name}</div>
                          <div className="text-sm text-slate-400">{account.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-100 font-mono">
                      ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-300">
                      <div>{account.balance.toFixed(6)} {account.symbol}</div>
                      <div className="text-xs text-slate-500">
                        ≈ ${(account.balance * price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button 
                        onClick={() => handleTradeClick(account.currency, 'buy')}
                        className="text-cyan-400 hover:text-cyan-300 mr-4 transition-colors"
                      >
                        Buy
                      </button>
                      <button 
                        onClick={() => handleTradeClick(account.currency, 'sell')}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {selectedCrypto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                    Current Price: <span className="text-white font-mono">${cryptoPrices[selectedCrypto].toLocaleString()}</span>
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Amount in USD
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-slate-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                value={amountUSD}
                                onChange={(e) => setAmountUSD(e.target.value)}
                                className="block w-full rounded-md border-slate-600 bg-slate-900 pl-7 pr-12 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                                placeholder="0.00"
                                autoFocus
                            />
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-slate-500 sm:text-sm">USD</span>
                             </div>
                        </div>
                    </div>

                    {amountUSD && !isNaN(parseFloat(amountUSD)) && (
                        <div className="p-3 bg-slate-900 rounded-lg">
                             <p className="text-sm text-slate-400 flex justify-between">
                                <span>Estimated {selectedCrypto}:</span>
                                <span className="text-white font-mono">
                                    {(parseFloat(amountUSD) / cryptoPrices[selectedCrypto]).toFixed(6)}
                                </span>
                             </p>
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setSelectedCrypto(null)}
                            className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                                tradeType === 'buy' 
                                ? 'bg-cyan-600 hover:bg-cyan-700' 
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            Confirm {tradeType === 'buy' ? 'Buy' : 'Sell'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CryptoView;
