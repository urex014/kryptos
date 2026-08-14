'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { DEFAULT_TREASURY_ADDRESS } from '../config/miningRigs';
import { X, Settings2, Save, RotateCcw, Check, ShieldAlert } from 'lucide-react';

interface TreasurySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TreasurySettingsModal({
  isOpen,
  onClose,
}: TreasurySettingsModalProps) {
  const { treasuryAddress, setTreasuryAddress } = useWeb3();
  const [addressInput, setAddressInput] = useState(treasuryAddress);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = addressInput.trim();
    if (!clean.startsWith('0x') || clean.length !== 42) {
      setError('Invalid 42-character Ethereum address (0x...)');
      return;
    }
    setError(null);
    setTreasuryAddress(clean);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setAddressInput(DEFAULT_TREASURY_ADDRESS);
    setTreasuryAddress(DEFAULT_TREASURY_ADDRESS);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md border border-zinc-800 bg-[#0d0e12] p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-orange-600 text-black font-black">
              <Settings2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">
                TREASURY ROUTING
              </h3>
              <p className="text-[11px] text-zinc-500">
                Destination Recipient Address
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

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1.5 uppercase text-[10px]">
              EVM Recipient Address
            </label>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => {
                setAddressInput(e.target.value);
                setError(null);
              }}
              placeholder="0x..."
              className="w-full border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-white focus:border-orange-500 focus:outline-none transition-colors"
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-400">{error}</p>
            )}
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-3 text-zinc-400 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-relaxed">
              All incoming ETH payments from purchased mining nodes are directly routed to this verified destination address.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 py-2.5 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET DEFAULT</span>
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-500 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>SAVED</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>SAVE TREASURY</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
