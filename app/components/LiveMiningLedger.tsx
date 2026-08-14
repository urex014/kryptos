'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MINED_WALLETS_500, ActiveMinerWallet } from '../config/mine';
import {
  Activity,
  Search,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Cpu,
  Zap,
  Radio,
  Clock,
  ArrowUpDown,
  Flame,
} from 'lucide-react';

export function LiveMiningLedger() {
  const [miners, setMiners] = useState<ActiveMinerWallet[]>(MINED_WALLETS_500);
  const [activeEvent, setActiveEvent] = useState<{
    address: string;
    rigModel: string;
    reward: string;
    timestamp: string;
  } | null>(null);

  const [recentlyUpdatedIds, setRecentlyUpdatedIds] = useState<Set<string>>(
    new Set()
  );

  // Search, Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [sortBy, setSortBy] = useState<'mined-desc' | 'mined-asc' | 'hashrate-desc' | 'shares-desc'>('mined-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Live real-time mining simulation engine
  useEffect(() => {
    const interval = setInterval(() => {
      setMiners((prevMiners) => {
        // Pick 4 to 8 random miners to increment
        const countToUpdate = Math.floor(Math.random() * 5) + 3;
        const targetIndices: number[] = [];
        for (let i = 0; i < countToUpdate; i++) {
          const idx = Math.floor(Math.random() * prevMiners.length);
          if (!targetIndices.includes(idx)) targetIndices.push(idx);
        }

        const newUpdatedIds = new Set<string>();
        let luckyMiner: ActiveMinerWallet | null = null;
        let randomReward = '0.00045';

        const updated = prevMiners.map((m, idx) => {
          if (targetIndices.includes(idx)) {
            newUpdatedIds.add(m.id);
            // Increment mined ETH based on hashrate
            const increment = (m.hashrateRaw * 0.00000004 * (0.8 + Math.random() * 0.4));
            const newMined = m.minedEth + increment;
            const newShares = m.sharesSubmitted + 1;

            if (!luckyMiner || Math.random() > 0.6) {
              luckyMiner = m;
              randomReward = increment.toFixed(6);
            }

            return {
              ...m,
              minedEth: newMined,
              sharesSubmitted: newShares,
              status: Math.random() > 0.2 ? 'hashing' : 'submitting_share',
            };
          }
          return m;
        });

        setRecentlyUpdatedIds(newUpdatedIds);

        if (luckyMiner) {
          const minerObj = luckyMiner as ActiveMinerWallet;
          setActiveEvent({
            address: minerObj.address,
            rigModel: minerObj.rigModel,
            reward: randomReward,
            timestamp: new Date().toLocaleTimeString(),
          });
        }

        return updated;
      });

      // Clear recent highlights after 800ms
      setTimeout(() => {
        setRecentlyUpdatedIds(new Set());
      }, 750);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  // Aggregated totals across all 500 wallets
  const totalMinedSum = useMemo(() => {
    return miners.reduce((acc, m) => acc + m.minedEth, 0);
  }, [miners]);

  const totalNetworkHashrate = useMemo(() => {
    return miners.reduce((acc, m) => acc + m.hashrateRaw, 0);
  }, [miners]);

  const totalShares = useMemo(() => {
    return miners.reduce((acc, m) => acc + m.sharesSubmitted, 0);
  }, [miners]);

  // Filtering & Sorting
  const filteredMiners = useMemo(() => {
    let result = [...miners];

    if (selectedTier !== 'All') {
      result = result.filter((m) => m.rigTier === selectedTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.address.toLowerCase().includes(q) ||
          m.rigModel.toLowerCase().includes(q) ||
          m.rigTier.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'mined-desc') {
      result.sort((a, b) => b.minedEth - a.minedEth);
    } else if (sortBy === 'mined-asc') {
      result.sort((a, b) => a.minedEth - b.minedEth);
    } else if (sortBy === 'hashrate-desc') {
      result.sort((a, b) => b.hashrateRaw - a.hashrateRaw);
    } else if (sortBy === 'shares-desc') {
      result.sort((a, b) => b.sharesSubmitted - a.sharesSubmitted);
    }

    return result;
  }, [miners, selectedTier, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMiners.length / pageSize) || 1;
  const paginatedMiners = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMiners.slice(start, start + pageSize);
  }, [filteredMiners, currentPage, pageSize]);

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 1800);
  };

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const tiers = ['All', 'Starter', 'Pro', 'Industrial', 'Datacenter', 'Apex'];

  return (
    <section className="space-y-6 pt-10 border-t border-zinc-800 font-mono">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-500 uppercase tracking-widest mb-1">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>GLOBAL PROTOCOL TELEMETRY // 500 NODES POOL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Live Mining Telemetry Ledger
          </h2>
          <p className="mt-1 text-xs text-zinc-400 max-w-xl">
            Real-time cryptographic hash discovery and cumulative ETH mined across 500 active distributed wallet nodes.
          </p>
        </div>

        {/* Live Event Pill Readout */}
        {activeEvent && (
          <div className="flex items-center gap-2.5 border border-zinc-800 bg-[#0d0e12] px-3.5 py-2 text-xs text-zinc-300">
            <span className="h-1.5 w-1.5 bg-orange-500 animate-ping" />
            <span className="text-zinc-500 text-[10px]">[{activeEvent.timestamp}]</span>
            <span className="text-orange-500 font-bold">
              {truncate(activeEvent.address)}
            </span>
            <span className="text-zinc-400">mined</span>
            <span className="text-white font-bold">+{activeEvent.reward} ETH</span>
          </div>
        )}
      </div>

      {/* Aggregate Global Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-[#0d0e12] p-4">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
            <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
            <span>TOTAL ETH MINED POOL</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-white">
            {totalMinedSum.toFixed(4)}{' '}
            <span className="text-orange-500 text-sm">ETH</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            ≈ ${(totalMinedSum * 3000).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0d0e12] p-4">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            <span>ACTIVE MINER WALLETS</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-white">
            500 <span className="text-xs text-zinc-500">WALLETS</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            100% ONLINE HASHING
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0d0e12] p-4">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            <span>AGGREGATE HASHRATE</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-orange-500">
            {(totalNetworkHashrate / 1000).toFixed(2)}{' '}
            <span className="text-xs text-white">PH/s</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Combined Processing Power
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0d0e12] p-4">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
            <Activity className="h-3.5 w-3.5 text-zinc-400" />
            <span>CRYPTOGRAPHIC SHARES</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-white">
            {totalShares.toLocaleString()}{' '}
            <span className="text-xs text-zinc-500">SHARES</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Verified EVM Nonces
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Tier Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTier(t);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                selectedTier === t
                  ? 'bg-orange-600 text-black font-bold'
                  : 'border border-zinc-800 bg-[#0d0e12] text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search 500 addresses..."
              className="w-full border border-zinc-800 bg-[#0d0e12] pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-zinc-800 bg-[#0d0e12] px-2.5 py-1.5 text-xs text-zinc-300 focus:border-orange-500 focus:outline-none cursor-pointer uppercase"
          >
            <option value="mined-desc">Highest Mined</option>
            <option value="mined-asc">Lowest Mined</option>
            <option value="hashrate-desc">Highest Hashrate</option>
            <option value="shares-desc">Most Shares</option>
          </select>
        </div>
      </div>

      {/* Real-Time Live Table */}
      <div className="overflow-x-auto border border-zinc-800 bg-[#0d0e12]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="py-3 px-4">RANK</th>
              <th className="py-3 px-4">MINER WALLET ADDRESS</th>
              <th className="py-3 px-4">HARDWARE NODE</th>
              <th className="py-3 px-4">UNITS</th>
              <th className="py-3 px-4">CAPACITY</th>
              <th className="py-3 px-4">TOTAL ETH MINED</th>
              <th className="py-3 px-4">SHARES</th>
              <th className="py-3 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {paginatedMiners.map((m, index) => {
              const isUpdated = recentlyUpdatedIds.has(m.id);
              const globalRank = (currentPage - 1) * pageSize + index + 1;
              const explorerUrl = `https://etherscan.io/address/${m.address}`;

              return (
                <tr
                  key={m.id}
                  className={`transition-colors duration-300 ${
                    isUpdated
                      ? 'bg-orange-950/40 text-orange-200'
                      : 'hover:bg-zinc-900/40'
                  }`}
                >
                  <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                    #{globalRank}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{truncate(m.address)}</span>

                      <button
                        onClick={() => handleCopy(m.address)}
                        title="Copy Address"
                        className="text-zinc-500 hover:text-orange-500 transition-colors p-0.5 cursor-pointer"
                      >
                        {copiedAddress === m.address ? (
                          <Check className="h-3 w-3 text-orange-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>

                      <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-orange-500 transition-colors p-0.5"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-zinc-300 font-semibold">
                    <span>{m.rigModel}</span>
                    <span className="text-orange-500 text-[10px] ml-1.5 uppercase">
                      [{m.rigTier}]
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-zinc-400">
                    {m.rigCount}x
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-zinc-200 font-bold">
                    {m.hashrate}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-black text-sm ${
                          isUpdated ? 'text-orange-400 font-bold' : 'text-white'
                        }`}
                      >
                        {m.minedEth.toFixed(6)}
                      </span>
                      <span className="text-orange-500 text-[10px]">ETH</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-zinc-400">
                    {m.sharesSubmitted.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span
                        className={`h-1.5 w-1.5 ${
                          isUpdated
                            ? 'bg-orange-400 animate-ping'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={
                          isUpdated ? 'text-orange-400 font-bold' : 'text-emerald-400'
                        }
                      >
                        {isUpdated ? 'SHARE ACCEPTED' : 'HASHING'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-zinc-500">
        <div>
          Showing{' '}
          <span className="text-white font-bold">
            {(currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="text-white font-bold">
            {Math.min(currentPage * pageSize, filteredMiners.length)}
          </span>{' '}
          of <span className="text-white font-bold">{filteredMiners.length}</span>{' '}
          wallets
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 border border-zinc-800 bg-[#0d0e12] px-3 py-1.5 text-zinc-300 hover:border-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>PREV</span>
          </button>

          <span className="px-2 font-bold text-white">
            PAGE {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 border border-zinc-800 bg-[#0d0e12] px-3 py-1.5 text-zinc-300 hover:border-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <span>NEXT</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
