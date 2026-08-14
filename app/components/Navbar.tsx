'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SUPPORTED_CHAINS } from '../config/miningRigs';
import {
  Cpu,
  Wallet,
  ChevronDown,
  Home,
  ShoppingBag,
  Server,
  Activity,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'fleet' | 'activity';
  setActiveTab: (tab: 'home' | 'catalog' | 'fleet' | 'activity') => void;
  onOpenWalletModal: () => void;
  onOpenAccountModal: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onOpenAccountModal,
}: NavbarProps) {
  const {
    address,
    chainId,
    balanceEth,
    isConnected,
    walletIcon,
    purchases,
    switchNetwork,
  } = useWeb3();

  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  const currentChain = chainId ? SUPPORTED_CHAINS[chainId] : null;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  const totalRigsCount = purchases.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#0a0b0e]/95 backdrop-blur-md text-zinc-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center bg-orange-600 text-black font-black shrink-0">
                <Cpu className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="font-bold tracking-tight text-white text-sm">
                    KRYPTOS
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-orange-500">
                    MINER.SYS
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono block -mt-0.5 uppercase tracking-wider">
                  EVM Hardware Layer
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-zinc-900 text-orange-500 font-bold border-b-2 border-orange-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                HOME
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-zinc-900 text-orange-500 font-bold border-b-2 border-orange-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                MARKETPLACE
              </button>

              <button
                onClick={() => setActiveTab('fleet')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  activeTab === 'fleet'
                    ? 'bg-zinc-900 text-orange-500 font-bold border-b-2 border-orange-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                MY FLEET {totalRigsCount > 0 ? `(${totalRigsCount})` : ''}
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-2 transition-colors cursor-pointer ${
                  activeTab === 'activity'
                    ? 'bg-zinc-900 text-orange-500 font-bold border-b-2 border-orange-500'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                ACTIVITY
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Network Selector */}
            {isConnected && (
              <div className="relative">
                <button
                  onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 border border-zinc-800 bg-zinc-900 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="hidden sm:inline">
                    {currentChain?.name || `Chain ${chainId}`}
                  </span>
                  <span className="sm:hidden text-[11px]">
                    {currentChain?.network.toUpperCase() || 'NET'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>

                {networkDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setNetworkDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 z-40 w-48 border border-zinc-800 bg-[#0d0e12] p-1 font-mono shadow-2xl">
                      <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                        Select Network
                      </div>
                      {Object.values(SUPPORTED_CHAINS).map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            switchNetwork(c.id);
                            setNetworkDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                            chainId === c.id
                              ? 'bg-orange-600/10 text-orange-400 font-bold'
                              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          <span>{c.name}</span>
                          {c.testnet && (
                            <span className="text-[10px] text-zinc-500">TEST</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Wallet Trigger */}
            {isConnected && address ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden lg:flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200">
                  <span className="text-orange-500 font-bold">Ξ</span>
                  <span>{balanceEth || '0.0000'}</span>
                  <span className="text-zinc-500 text-[10px]">ETH</span>
                </div>

                <button
                  onClick={onOpenAccountModal}
                  className="flex items-center gap-1.5 sm:gap-2 border border-orange-600/60 bg-zinc-900 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-mono font-medium text-white hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  {walletIcon ? (
                    <img
                      src={walletIcon}
                      alt="Wallet"
                      className="h-3.5 w-3.5 object-contain shrink-0"
                    />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  )}
                  <span className="text-[11px] sm:text-xs">{truncateAddress(address)}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="flex items-center gap-1.5 sm:gap-2 bg-orange-600 hover:bg-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer shrink-0"
              >
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar for Ergonomic Touch */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-[#0a0b0e]/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around font-mono text-[10px] pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'home' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>HOME</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'catalog' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>STORE</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors relative ${
            activeTab === 'fleet' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Server className="h-4 w-4" />
            {totalRigsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-black">
                {totalRigsCount}
              </span>
            )}
          </div>
          <span>FLEET</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'activity' ? 'text-orange-500 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>LOGS</span>
        </button>
      </div>
    </>
  );
}
