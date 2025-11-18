
import React from 'react';
import { User, Account, CryptoPrices } from '../types';
import { EXCHANGE_RATES } from '../constants';
import { BanknoteIcon, ArrowRightLeftIcon, TrendingUpIcon } from './Icons';

interface DashboardProps {
  user: User;
  cryptoPrices: CryptoPrices;
  onNavigate: (view: 'exchange' | 'crypto') => void;
}

const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-400">{account.currency}</p>
        <p className="text-2xl font-bold text-slate-100">
          {account.symbol}
          {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
       <div className="bg-cyan-500/10 p-3 rounded-full">
         <BanknoteIcon className="h-6 w-6 text-cyan-400" />
       </div>
    </div>
  );
};


const Dashboard: React.FC<DashboardProps> = ({ user, cryptoPrices, onNavigate }) => {
    const totalFiatBalanceUSD = user.accounts.reduce((total, account) => {
        const rate = EXCHANGE_RATES[account.currency];
        const balanceInUSD = account.balance / rate;
        return total + balanceInUSD;
    }, 0);

    const totalCryptoBalanceUSD = user.cryptoAccounts.reduce((total, account) => {
        const price = cryptoPrices[account.currency];
        return total + (account.balance * price);
    }, 0);

    const totalBalanceUSD = totalFiatBalanceUSD + totalCryptoBalanceUSD;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">Welcome back, {user.name}!</h1>
        <p className="mt-1 text-slate-400">Here's a summary of your financial portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-lg shadow-xl text-white flex flex-col justify-between">
            <div>
                <p className="text-lg font-medium">Total Net Worth (USD)</p>
                <p className="text-4xl font-bold tracking-tight">
                ${totalBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="space-y-2 mt-4">
                <button 
                    onClick={() => onNavigate('exchange')}
                    className="w-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <ArrowRightLeftIcon className="h-5 w-5 mr-2"/>
                    Exchange Fiat
                </button>
                <button 
                    onClick={() => onNavigate('crypto')}
                    className="w-full flex items-center justify-center bg-slate-900/30 hover:bg-slate-900/40 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <TrendingUpIcon className="h-5 w-5 mr-2"/>
                    Invest in Crypto
                </button>
            </div>
        </div>
        <div className="md:col-span-2 space-y-6">
             <h2 className="text-xl font-semibold text-slate-200">Fiat Accounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {user.accounts.map(account => (
                    <AccountCard key={account.currency} account={account} />
                ))}
            </div>
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex items-center justify-between border border-slate-700">
                <div>
                    <p className="text-sm text-slate-400">Total Crypto Holdings</p>
                    <p className="text-2xl font-bold text-slate-100">
                        ${totalCryptoBalanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                 <div className="bg-purple-500/10 p-3 rounded-full">
                     <TrendingUpIcon className="h-6 w-6 text-purple-400" />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
