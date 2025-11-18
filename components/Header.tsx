
import React from 'react';
import { User } from '../types';
import { BanknoteIcon, UserIcon, LogOutIcon } from './Icons';

interface HeaderProps {
  user: User;
  onNavigate: (view: 'dashboard' | 'exchange' | 'crypto') => void;
  onLogout: () => void;
  activeView: 'dashboard' | 'exchange' | 'crypto';
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout, activeView }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BanknoteIcon className="h-8 w-8 text-cyan-400" />
            <span className="ml-3 text-2xl font-bold text-slate-100">Gemini Financial</span>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
             <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('exchange')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'exchange'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Exchange
            </button>
            <button
              onClick={() => onNavigate('crypto')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'crypto'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              Crypto
            </button>
          </nav>
          <div className="flex items-center">
             <div className="flex items-center mr-4">
                <UserIcon className="h-6 w-6 text-slate-400" />
                <span className="ml-2 text-slate-200 font-medium">{user.name}</span>
             </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-colors"
              title="Logout"
            >
              <LogOutIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="md:hidden flex justify-center space-x-2 py-2 border-t border-slate-700">
             <button
              onClick={() => onNavigate('dashboard')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 bg-slate-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('exchange')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'exchange'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 bg-slate-700'
              }`}
            >
              Exchange
            </button>
            <button
              onClick={() => onNavigate('crypto')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'crypto'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-300 bg-slate-700'
              }`}
            >
              Crypto
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
