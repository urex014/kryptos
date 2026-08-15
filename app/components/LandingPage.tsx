'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { MINING_RIGS, MiningRig } from '../config/miningRigs';
import { useWeb3 } from '../context/Web3Context';
import { ThreeMinerScene } from './ThreeMinerScene';
import { ThreeRigCardViewer } from './ThreeRigCardViewer';
import { LiveMiningLedger } from './LiveMiningLedger';
import {
  Cpu,
  Zap,
  Gauge,
  Flame,
  ArrowRight,
  Terminal,
  Activity,
  Server,
  Layers,
  ChevronRight,
  Shield,
  Clock,
  Radio,
} from 'lucide-react';

interface LandingPageProps {
  onEnterCatalog: () => void;
  onSelectBuyRig: (rig: MiningRig) => void;
  onOpenWalletModal: () => void;
}

export function LandingPage({
  onEnterCatalog,
  onSelectBuyRig,
  onOpenWalletModal,
}: LandingPageProps) {
  const { isConnected, balanceEth } = useWeb3();

  // Refs for GSAP animation targets
  const heroTextRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Terminal log stream state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Kryptos Kernel v4.8.2 initialized on Ethereum EVM',
    '[NETWORK] Synced to block #21,849,203 • Difficulty 84.23 T',
    '[NODE_01] Kryptos X-100 online • Hashrate: 110.4 TH/s • Temp: 58°C',
    '[SETTLE] Treasury channel active • Gas base fee: 12.4 Gwei',
  ]);

  // Terminal live stream simulation
  useEffect(() => {
    const messages = [
      '[HASH] Block hash candidate verified: 0x8a9f...32b1',
      '[TELEMETRY] Fleet power draw balanced: 14.2 J/TH efficiency',
      '[NODE_05] Apex Immersion chamber thermal stability: 34.2°C nominal',
      '[RPC] Inbound payment verification listener primed',
      '[YIELD] Daily reward epoch recalculated: +0.00045 ETH/TH',
      '[SYNC] State commitment confirmed on-chain',
    ];

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLogs((prev) => [
        `[${timestamp}] ${randomMsg}`,
        ...prev.slice(0, 5),
      ]);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      if (heroTextRef.current) {
        gsap.from(heroTextRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // Metrics counters entrance
      if (metricsRef.current) {
        gsap.from(metricsRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
        });
      }

      // Hardware Cards entrance
      if (cardsGridRef.current) {
        gsap.from(cardsGridRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.5,
        });
      }

      // Protocol Steps entrance
      if (stepsRef.current) {
        gsap.from(stepsRef.current.children, {
          y: 25,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.7,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* ================= SECTION 1: HERO WITH THREE.JS ================= */}
      <section className="relative pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Controls */}
          <div ref={heroTextRef} className="lg:col-span-6 space-y-6">
            {/* Minimalist Tech Monospace Tag */}
            <div className="flex items-center gap-3 text-xs font-mono text-orange-500 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 bg-orange-500" />
              <span>PROTOCOL // HARDWARE NODES</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">ETH SETTLEMENT</span>
            </div>

            {/* Solid Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
              Decentralized <br />
              <span className="text-orange-500">ASIC Mining</span> <br />
              Infrastructure
            </h1>

            {/* Technical Subtext */}
            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
              Connect your Web3 wallet and deploy engineered cryptographic hashing hardware directly using Ethereum. Zero intermediaries, instant on-chain receipts, and real-time operational telemetry.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnterCatalog}
                className="flex items-center gap-2.5 rounded-none bg-orange-600 hover:bg-orange-500 px-6 py-4 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors shadow-lg shadow-orange-600/10 cursor-pointer"
              >
                <span>Deploy Mining Rigs</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              {!isConnected ? (
                <button
                  onClick={onOpenWalletModal}
                  className="flex items-center gap-2 rounded-none border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 hover:border-zinc-500 px-6 py-4 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 transition-colors cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-xs font-mono text-zinc-300">
                  <span className="h-2 w-2 bg-emerald-500" />
                  <span>Wallet Active: {balanceEth || '0'} ETH</span>
                </div>
              )}
            </div>

            {/* Micro Specs Ticker */}
            <div className="pt-4 border-t border-zinc-900 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <div className="text-zinc-500 text-[10px] uppercase">
                  PAYMENT ASSET
                </div>
                <div className="text-zinc-200 font-bold mt-0.5">ETH Native</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px] uppercase">
                  SETTLEMENT
                </div>
                <div className="text-zinc-200 font-bold mt-0.5">On-Chain</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px] uppercase">
                  RIG FLEET
                </div>
                <div className="text-orange-500 font-bold mt-0.5">6 Models</div>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js Interactive 3D Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center border border-zinc-800/80 bg-zinc-950/60 overflow-hidden">
            {/* Technical grid overlay marks */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-600 select-none">
              3D.SYS // CLUSTER.NODE.MESH
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-orange-500/70 select-none">
              INTERACTIVE PARALLAX
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-zinc-600 select-none">
              COORDS [37.7749, -122.4194]
            </div>
            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-600 select-none">
              FPS: 60
            </div>

            <ThreeMinerScene />
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: TELEMETRY METRICS TICKER ================= */}
      <section ref={metricsRef} className="border-y border-zinc-800/80 py-6 bg-zinc-950/40">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border-l-2 border-orange-600 pl-4 space-y-1">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Network Hash Capacity
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white">
              12.8 <span className="text-orange-500 text-lg">PH/s</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Distributed across clusters
            </div>
          </div>

          <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Average Efficiency
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white">
              14.2 <span className="text-zinc-400 text-lg">J/TH</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Dielectric immersion standard
            </div>
          </div>

          <div className="border-l-2 border-orange-600 pl-4 space-y-1">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Hardware Uptime
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white">
              99.98<span className="text-orange-500 text-lg">%</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Zero failover redundancy
            </div>
          </div>

          <div className="border-l-2 border-zinc-700 pl-4 space-y-1">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Settlement Protocol
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-white">
              EVM <span className="text-zinc-400 text-lg">Direct</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-500">
              Trustless verified contract
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: 5 MINING RIGS SHOWCASE ================= */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-wider mb-1">
              <Cpu className="h-3.5 w-3.5" />
              <span>Engineered Hardware Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              5 High-Throughput ASIC Nodes
            </h2>
          </div>

          <button
            onClick={onEnterCatalog}
            className="flex items-center gap-2 self-start md:self-auto text-xs font-mono font-bold uppercase text-orange-500 hover:text-orange-400 transition-colors"
          >
            <span>View Full Marketplace & Filters</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 5 Hardware Cards Grid */}
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MINING_RIGS.map((rig, idx) => {
            const approxUsd = (parseFloat(rig.priceEth) * 3000).toLocaleString(
              'en-US',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            );

            return (
              <div
                key={rig.id}
                className="group flex flex-col justify-between border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-orange-500/70"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-3 border-b border-zinc-900">
                    <span>NODE // 0{idx + 1}</span>
                    <span className="text-orange-500 uppercase">{rig.tier}</span>
                  </div>

                  {/* Hardware 3D Model */}
                  <div className="my-4">
                    <ThreeRigCardViewer
                      modelUrl={rig.modelUrl}
                      onlineModelUrl={rig.onlineModelUrl}
                      rigName={rig.name}
                      tier={rig.tier}
                    />
                  </div>

                  {/* Rig Title */}
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {rig.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                    {rig.tagline}
                  </p>

                  {/* Technical Specs List */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="border border-zinc-900 bg-zinc-900/50 p-2">
                      <span className="text-zinc-500 text-[10px] uppercase block">
                        Hashrate
                      </span>
                      <span className="font-bold text-white">{rig.hashrate}</span>
                    </div>
                    <div className="border border-zinc-900 bg-zinc-900/50 p-2">
                      <span className="text-zinc-500 text-[10px] uppercase block">
                        Est. Yield
                      </span>
                      <span className="font-bold text-orange-500">
                        {rig.estDailyEth}/d
                      </span>
                    </div>
                    <div className="border border-zinc-900 bg-zinc-900/50 p-2">
                      <span className="text-zinc-500 text-[10px] uppercase block">
                        Power Draw
                      </span>
                      <span className="text-zinc-300">{rig.powerDraw}</span>
                    </div>
                    <div className="border border-zinc-900 bg-zinc-900/50 p-2">
                      <span className="text-zinc-500 text-[10px] uppercase block">
                        Efficiency
                      </span>
                      <span className="text-zinc-300">{rig.efficiency}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action & Price */}
                <div className="mt-6 pt-4 border-t border-zinc-900">
                  <div className="flex items-baseline justify-between mb-3 font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-500 block">
                        Price
                      </span>
                      <span className="text-xl font-bold text-white">
                        {rig.priceEth}{' '}
                        <span className="text-orange-500 text-sm">ETH</span>
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">≈ ${approxUsd}</div>
                  </div>

                  <button
                    onClick={() => onSelectBuyRig(rig)}
                    className="flex w-full items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
                  >
                    <span>Purchase with ETH</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live 500 Miner Wallets Telemetry Ledger */}
        <LiveMiningLedger />
      </section>

      {/* ================= SECTION 4: PROTOCOL ARCHITECTURE ================= */}
      <section className="space-y-8">
        <div className="pb-4 border-b border-zinc-800">
          <div className="text-xs font-mono text-orange-500 uppercase tracking-wider mb-1">
            Execution Flow
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Protocol Architecture & Purchase Pipeline
          </h2>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <div className="font-mono text-2xl font-black text-orange-500">
              01
            </div>
            <h4 className="text-sm font-bold text-white uppercase font-mono">
              Wallet Handshake
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connect via EIP-6963 multi-injected provider (MetaMask, Rabby, Coinbase) on Ethereum Mainnet, Base, or Arbitrum.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <div className="font-mono text-2xl font-black text-orange-500">
              02
            </div>
            <h4 className="text-sm font-bold text-white uppercase font-mono">
              Hardware Selection
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Select desired ASIC model and configure quantity. System verifies balance and estimates exact gas fees.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <div className="font-mono text-2xl font-black text-orange-500">
              03
            </div>
            <h4 className="text-sm font-bold text-white uppercase font-mono">
              ETH Settlement
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sign standard ETH transaction. Funds route directly to verified protocol treasury with instant block receipt.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3">
            <div className="font-mono text-2xl font-black text-orange-500">
              04
            </div>
            <h4 className="text-sm font-bold text-white uppercase font-mono">
              Fleet Telemetry
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hardware node is assigned to your account address. Real-time combined hashrate and yield forecast go live.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: LIVE CONSOLE TELEMETRY ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Terminal className="h-4 w-4 text-orange-500" />
            <span className="uppercase font-bold text-zinc-200">
              Live Node Stream // Kernel Console
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="h-1.5 w-1.5 bg-emerald-400" />
            <span>STREAMING REAL-TIME</span>
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 space-y-2">
          {terminalLogs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                index === 0 ? 'text-orange-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              <span className="text-zinc-600 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SECTION 6: BOTTOM CALL TO ACTION ================= */}
      <section className="border border-zinc-800 bg-zinc-950 p-8 sm:p-12 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Ready to Deploy Your Mining Fleet?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Connect your wallet to browse the catalog, inspect verified specifications, and purchase nodes with instant on-chain confirmation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onEnterCatalog}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
          >
            <span>Open Marketplace</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>

          {!isConnected && (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-6 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200 transition-colors cursor-pointer"
            >
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
