'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from '../config/miningRigs';
import {
  Activity,
  ExternalLink,
  Trash2,
} from 'lucide-react';

export function ActivityLog() {
  const { purchases } = useWeb3();

  const truncate = (str: string) => `${str.slice(0, 6)}...${str.slice(-4)}`;

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clearHistory = () => {
    if (confirm('Clear local transaction ledger?')) {
      localStorage.removeItem('mining_rig_purchases');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-500 uppercase tracking-widest mb-1">
            <Activity className="h-3.5 w-3.5" />
            <span>TRANSACTION REPOSITORIES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            On-Chain Payment Activity
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Cryptographically verified hardware node settlements and EVM receipts.
          </p>
        </div>

        {purchases.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 self-start sm:self-auto border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:border-red-900/60 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>CLEAR LEDGER</span>
          </button>
        )}
      </div>

      {/* Purchases List or Empty */}
      {purchases.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-zinc-800 bg-[#0d0e12] p-12 text-center">
          <h3 className="text-sm font-bold text-zinc-400 uppercase">
            NO TRANSACTION RECORDS FOUND
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm">
            All executed mining hardware purchases and EVM receipts will be indexed here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 bg-[#0d0e12]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">HARDWARE MODEL</th>
                <th className="py-3 px-4">QTY</th>
                <th className="py-3 px-4">SETTLED (ETH)</th>
                <th className="py-3 px-4">NETWORK</th>
                <th className="py-3 px-4">RECIPIENT</th>
                <th className="py-3 px-4">STATUS // TX HASH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {purchases.map((p) => {
                const chain = SUPPORTED_CHAINS[p.chainId] || SUPPORTED_CHAINS[DEFAULT_CHAIN_ID];
                const explorerUrl = chain?.blockExplorers?.url
                  ? `${chain.blockExplorers.url}/tx/${p.txHash}`
                  : `https://etherscan.io/tx/${p.txHash}`;

                return (
                  <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {formatDate(p.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {p.rigName}
                    </td>
                    <td className="py-3.5 px-4 text-orange-500 whitespace-nowrap">
                      {p.quantity}x
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {p.totalEth} ETH
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 whitespace-nowrap">
                      {chain?.name.toUpperCase() || `CHAIN ${p.chainId}`}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 whitespace-nowrap" title={p.recipient}>
                      {truncate(p.recipient)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold text-[11px]">
                          [CONFIRMED]
                        </span>

                        <a
                          href={explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-400 hover:text-orange-500 hover:border-zinc-700 transition-colors"
                        >
                          <span>{truncate(p.txHash)}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
