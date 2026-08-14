'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SUPPORTED_CHAINS } from '../config/miningRigs';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const {
    address,
    chainId,
    balanceEth,
    walletName,
    isDemoWallet,
    disconnect,
    switchNetwork,
    refreshBalance,
  } = useWeb3();

  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen || !address) return null;

  const currentChain = chainId ? SUPPORTED_CHAINS[chainId] : null;
  const explorerUrl = currentChain?.blockExplorers?.url
    ? `${currentChain.blockExplorers.url}/address/${address}`
    : `https://etherscan.io/address/${address}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md border border-zinc-800 bg-[#0d0e12] p-5 sm:p-6 shadow-2xl transition-all max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-orange-600 text-black font-bold text-xs">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {walletName || 'CONNECTED WALLET'}
              </div>
              <p className="text-xs text-zinc-400">
                {truncateAddress(address)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="mt-5 border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
              AVAILABLE BALANCE
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-orange-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`}
              />
              REFRESH
            </button>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="text-2xl font-black text-white">
              {balanceEth ? `${balanceEth}` : '0.0000'}{' '}
              <span className="text-orange-500 text-base">ETH</span>
            </div>
            <span className="text-xs text-zinc-500">
              ≈ ${(parseFloat(balanceEth || '0') * 3000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* Address Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 py-2.5 px-3 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-orange-500">COPIED</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>COPY ADDRESS</span>
              </>
            )}
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 py-2.5 px-3 text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
            <span>EXPLORER</span>
          </a>
        </div>

        {/* Network Switcher */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">
              ACTIVE NETWORK
            </span>
            <span className="text-xs text-orange-500 font-bold">
              {currentChain?.name.toUpperCase() || `CHAIN ${chainId}`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.values(SUPPORTED_CHAINS).map((chain) => {
              const isActive = chainId === chain.id;
              return (
                <button
                  key={chain.id}
                  onClick={() => switchNetwork(chain.id)}
                  className={`flex items-center justify-between border p-2 text-left text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'border-orange-500 bg-orange-600/10 text-orange-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="truncate">{chain.name}</span>
                  {isActive && <Check className="h-3 w-3 text-orange-500 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sepolia Faucet tip if on Sepolia */}
        {chainId === 11155111 && (
          <div className="mt-4 border border-zinc-800 bg-zinc-950 p-3 flex items-start gap-2 text-xs">
            <Zap className="h-3.5 w-3.5 text-orange-500 mt-0.5 shrink-0" />
            <div className="text-zinc-400">
              <span>Need testnet Sepolia ETH? </span>
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline hover:text-orange-400"
              >
                Get Sepolia ETH &rarr;
              </a>
            </div>
          </div>
        )}

        {/* Footer Disconnect */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <button
            onClick={handleDisconnect}
            className="flex w-full items-center justify-center gap-2 border border-red-900/60 bg-red-950/20 py-2.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer uppercase"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Disconnect Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
