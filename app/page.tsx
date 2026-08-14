'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MINING_RIGS, MiningRig } from './config/miningRigs';
import { useWeb3 } from './context/Web3Context';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { RigCard } from './components/RigCard';
import { WalletModal } from './components/WalletModal';
import { AccountModal } from './components/AccountModal';
import { PurchaseModal } from './components/PurchaseModal';
import { FleetView } from './components/FleetView';
import { ActivityLog } from './components/ActivityLog';
import { TreasurySettingsModal } from './components/TreasurySettingsModal';
import { LiveMiningLedger } from './components/LiveMiningLedger';
import {
  Cpu,
  Zap,
  Search,
  ChevronRight,
  Radio,
} from 'lucide-react';

export default function Home() {
  const { purchases, isConnected, balanceEth } = useWeb3();

  // Navigation & Modals with reload persistence
  const [activeTab, setActiveTabState] = useState<
    'home' | 'catalog' | 'fleet' | 'activity'
  >('home');

  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [treasuryModalOpen, setTreasuryModalOpen] = useState(false);
  const [selectedRigForPurchase, setSelectedRigForPurchase] =
    useState<MiningRig | null>(null);

  // Restore saved tab from URL hash or localStorage on reload
  useEffect(() => {
    const validTabs = ['home', 'catalog', 'fleet', 'activity'];

    // 1. Check URL Hash first (e.g. #catalog, #fleet)
    const hash = window.location.hash.replace('#', '');
    if (validTabs.includes(hash)) {
      setActiveTabState(hash as any);
      return;
    }

    // 2. Check localStorage fallback
    try {
      const savedTab = localStorage.getItem('kryptos_active_tab');
      if (savedTab && validTabs.includes(savedTab)) {
        setActiveTabState(savedTab as any);
        window.history.replaceState(null, '', `#${savedTab}`);
      }
    } catch (e) {
      console.error('Failed to read tab from localStorage', e);
    }
  }, []);

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'catalog', 'fleet', 'activity'].includes(hash)) {
        setActiveTabState(hash as any);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Tab switcher that updates URL hash and persists to localStorage
  const setActiveTab = (tab: 'home' | 'catalog' | 'fleet' | 'activity') => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('kryptos_active_tab', tab);
      window.history.replaceState(null, '', `#${tab}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Filters & Sorting
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate owned count per rig
  const ownedRigCounts = useMemo(() => {
    return purchases.reduce((acc, p) => {
      acc[p.rigId] = (acc[p.rigId] || 0) + p.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [purchases]);

  // Filter & Sort Rigs
  const filteredRigs = useMemo(() => {
    let list = [...MINING_RIGS];

    if (selectedTier !== 'All') {
      list = list.filter((r) => r.tier === selectedTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tagline.toLowerCase().includes(q) ||
          r.algorithm.toLowerCase().includes(q) ||
          r.hashrate.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => parseFloat(a.priceEth) - parseFloat(b.priceEth));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => parseFloat(b.priceEth) - parseFloat(a.priceEth));
    } else if (sortBy === 'hashrate') {
      list.sort((a, b) => b.hashrateRaw - a.hashrateRaw);
    }

    return list;
  }, [selectedTier, searchQuery, sortBy]);

  const tiers = ['All', 'Starter', 'Pro', 'Industrial', 'Datacenter', 'Apex'];

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 selection:bg-orange-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onOpenAccountModal={() => setAccountModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        {/* Tab 0: High-Impact Landing Page */}
        {activeTab === 'home' && (
          <LandingPage
            onEnterCatalog={() => setActiveTab('catalog')}
            onSelectBuyRig={(rig) => setSelectedRigForPurchase(rig)}
            onOpenWalletModal={() => setWalletModalOpen(true)}
          />
        )}

        {/* Tab 1: Marketplace / Catalog */}
        {activeTab === 'catalog' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Marketplace Header */}
            <div className="border border-zinc-800 bg-[#0d0e12] p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest mb-1">
                    <span className="h-1.5 w-1.5 bg-orange-500" />
                    <span>ENGINEERED ASIC INVENTORY</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Mining Hardware Marketplace
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                    Select an ASIC node configuration and execute payment via your connected Web3 wallet using ETH.
                  </p>
                </div>

                {!isConnected ? (
                  <button
                    onClick={() => setWalletModalOpen(true)}
                    className="flex items-center gap-2 self-start md:self-auto bg-orange-600 hover:bg-orange-500 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Connect Wallet to Buy</span>
                  </button>
                ) : (
                  <div className="border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs font-mono text-zinc-300">
                    <span className="text-zinc-500 uppercase">Available: </span>
                    <span className="text-white font-bold">{balanceEth || '0.0000'} ETH</span>
                  </div>
                )}
              </div>

              {/* Hardware Quick Readouts */}
              <div className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    DEPLOYABLE MODELS
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    5 Distinct Units
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    PEAK HASHRATE
                  </div>
                  <div className="text-base font-bold text-orange-500 mt-0.5">
                    6.8 PH/s Apex
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    PAYMENT ASSET
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Native ETH
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">
                    SYSTEM STATUS
                  </div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-emerald-400" />
                    OPERATIONAL
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
              {/* Tier Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      selectedTier === tier
                        ? 'bg-orange-600 text-black font-bold'
                        : 'border border-zinc-800 bg-[#0d0e12] text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* Search & Sort */}
              <div className="flex items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, specs..."
                    className="w-full border border-zinc-800 bg-[#0d0e12] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-zinc-800 bg-[#0d0e12] px-3 py-2 text-xs text-zinc-300 focus:border-orange-500 focus:outline-none cursor-pointer uppercase"
                  >
                    <option value="recommended">Featured Order</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="hashrate">Highest Hashrate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mining Rigs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRigs.map((rig) => (
                <RigCard
                  key={rig.id}
                  rig={rig}
                  ownedCount={ownedRigCounts[rig.id] || 0}
                  onSelectBuy={(selected) => setSelectedRigForPurchase(selected)}
                />
              ))}
            </div>

            {/* Live 500 Miner Wallets Telemetry Ledger */}
            <LiveMiningLedger />
          </div>
        )}

        {/* Tab 2: My Fleet */}
        {activeTab === 'fleet' && (
          <FleetView onNavigateToCatalog={() => setActiveTab('catalog')} />
        )}

        {/* Tab 3: Activity Ledger */}
        {activeTab === 'activity' && <ActivityLog />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#0a0b0e] py-8 mt-12 mb-16 md:mb-0 font-mono text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-orange-500" />
            <span className="text-zinc-400">KRYPTOS PROTOCOL // HARDWARE NODES</span>
          </div>
          <div className="flex items-center gap-4">
            <span>DIRECT EVM SETTLEMENT</span>
            <span>•</span>
            <button
              onClick={() => setTreasuryModalOpen(true)}
              className="hover:text-orange-500 transition-colors cursor-pointer uppercase"
            >
              Configure Treasury
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
      />

      <PurchaseModal
        isOpen={!!selectedRigForPurchase}
        onClose={() => setSelectedRigForPurchase(null)}
        rig={selectedRigForPurchase}
        onOpenWalletModal={() => {
          setSelectedRigForPurchase(null);
          setWalletModalOpen(true);
        }}
        onNavigateToFleet={() => {
          setSelectedRigForPurchase(null);
          setActiveTab('fleet');
        }}
      />

      <TreasurySettingsModal
        isOpen={treasuryModalOpen}
        onClose={() => setTreasuryModalOpen(false)}
      />
    </div>
  );
}
