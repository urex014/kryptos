'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SUPPORTED_CHAINS } from '../config/miningRigs';
import {
  Cpu,
  Wallet,
  ChevronDown,
  Activity,
  Settings2,
  Server,
  Zap,
  Home as HomeIcon,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'catalog' | 'fleet' | 'activity';
  setActiveTab: (tab: 'home' | 'catalog' | 'fleet' | 'activity') => void;
  onOpenWalletModal: () => void;
  onOpenAccountModal: () => void;
  onOpenTreasuryModal: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenWalletModal,
  onOpenAccountModal,
  onOpenTreasuryModal,
}: NavbarProps) {
  const {
    address,
    chainId,
    balanceEth,
    isConnected,
    walletIcon,
    isDemoWallet,
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-[#0a0b0e] text-zinc-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center bg-orange-600 text-black font-black">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="font-bold tracking-tight text-white text-sm">
                  KRYPTOS
                </span>
                <span className="text-xs font-bold text-orange-500">
                  MINER.SYS
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono block -mt-0.5 uppercase tracking-wider">
                EVM Hardware Layer
              </span>
            </div>
          </button>

          {/* Navigation Tabs */}
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
        <div className="flex items-center gap-3">
          {/* Treasury Config */}
          <button
            onClick={onOpenTreasuryModal}
            title="Treasury Recipient Configuration"
            className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">TREASURY</span>
          </button>

          {/* Network Selector */}
          {isConnected && (
            <div className="relative">
              <button
                onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
                className="flex items-center gap-2 border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-mono text-zinc-200 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <span className="h-1.5 w-1.5 bg-orange-500" />
                <span className="hidden sm:inline">
                  {currentChain?.name || `Chain ${chainId}`}
                </span>
                <span className="sm:hidden">
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
                  <div className="absolute right-0 mt-1 z-40 w-48 border border-zinc-800 bg-[#0d0e12] p-1 font-mono">
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
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200">
                <span className="text-orange-500 font-bold">Ξ</span>
                <span>{balanceEth || '0.0000'}</span>
                <span className="text-zinc-500 text-[10px]">ETH</span>
              </div>

              <button
                onClick={onOpenAccountModal}
                className="flex items-center gap-2 border border-orange-600/60 bg-zinc-900 px-3.5 py-2 text-xs font-mono font-medium text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                {walletIcon ? (
                  <img
                    src={walletIcon}
                    alt="Wallet"
                    className="h-3.5 w-3.5 object-contain"
                  />
                ) : (
                  <span className="h-1.5 w-1.5 bg-orange-500" />
                )}
                <span>{truncateAddress(address)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-zinc-800 px-4 py-2 bg-[#0d0e12] justify-around font-mono text-xs">
        <button
          onClick={() => setActiveTab('home')}
          className={`py-1 px-2 ${activeTab === 'home' ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}
        >
          HOME
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-1 px-2 ${activeTab === 'catalog' ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}
        >
          STORE
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`py-1 px-2 ${activeTab === 'fleet' ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}
        >
          FLEET ({totalRigsCount})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`py-1 px-2 ${activeTab === 'activity' ? 'text-orange-500 font-bold' : 'text-zinc-400'}`}
        >
          LOGS
        </button>
      </div>
    </header>
  );
}
