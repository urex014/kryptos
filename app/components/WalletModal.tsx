'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Wallet, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    connect,
    connectDemoWallet,
    discoveredProviders,
    isConnecting,
  } = useWeb3();

  if (!isOpen) return null;

  const handleConnect = async (providerDetail?: any) => {
    try {
      await connect(providerDetail);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemoConnect = () => {
    connectDemoWallet();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md border border-zinc-800 bg-[#0d0e12] p-6 shadow-2xl transition-all font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-orange-600 text-black font-black">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">
                AUTHENTICATE WALLET
              </h3>
              <p className="text-[11px] text-zinc-500">
                EVM Browser Injected Provider
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

        {/* Wallets List */}
        <div className="mt-5 space-y-3 text-xs">
          {/* EIP-6963 Discovered Wallets */}
          {discoveredProviders.length > 0 && (
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                DETECTED EXTENSIONS
              </div>
              <div className="space-y-2">
                {discoveredProviders.map((providerDetail) => (
                  <button
                    key={providerDetail.info.uuid}
                    disabled={isConnecting}
                    onClick={() => handleConnect(providerDetail)}
                    className="group flex w-full items-center justify-between border border-zinc-800 bg-zinc-950 p-3 hover:border-orange-500/80 hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {providerDetail.info.icon ? (
                        <img
                          src={providerDetail.info.icon}
                          alt={providerDetail.info.name}
                          className="h-6 w-6 object-contain"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center bg-zinc-900 text-zinc-300">
                          <Wallet className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-orange-500 transition-colors">
                          {providerDetail.info.name}
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          READY // INJECTED
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-orange-500 group-hover:translate-x-0.5 transition-transform">
                      CONNECT &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Standard Injected / MetaMask / Rabby fallback */}
          {discoveredProviders.length === 0 && (
            <button
              disabled={isConnecting}
              onClick={() => handleConnect()}
              className="group flex w-full items-center justify-between border border-zinc-800 bg-zinc-950 p-3.5 hover:border-orange-500/80 hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center bg-orange-600/10 border border-orange-600/30 text-orange-500">
                  <Wallet className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-orange-500 transition-colors">
                    Browser Injected Extension
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    MetaMask, Rabby, Coinbase, Brave
                  </span>
                </div>
              </div>
              <span className="text-xs text-orange-500">
                CONNECT &rarr;
              </span>
            </button>
          )}

          {/* Instant Demo Sandbox Wallet */}
          <div className="pt-2">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              DEVELOPMENT & TESTING
            </div>
            <button
              disabled={isConnecting}
              onClick={handleDemoConnect}
              className="group flex w-full items-center justify-between border border-orange-900/60 bg-zinc-950 p-3.5 hover:border-orange-500 hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center bg-orange-600/20 text-orange-500">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-orange-400">
                    Sandbox Test Wallet
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    Preloaded 5.0 ETH • Simulated Checkout
                  </span>
                </div>
              </div>
              <span className="text-xs text-orange-500">
                LAUNCH &rarr;
              </span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
          <span>ETH PROTOCOL HANDSHAKE</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
