'use client';

import React from 'react';
import Image from 'next/image';
import { useWeb3 } from '../context/Web3Context';
import { MINING_RIGS } from '../config/miningRigs';
import {
  Zap,
  Gauge,
  TrendingUp,
  Server,
  ArrowRight,
} from 'lucide-react';

interface FleetViewProps {
  onNavigateToCatalog: () => void;
}

export function FleetView({ onNavigateToCatalog }: FleetViewProps) {
  const { purchases } = useWeb3();

  // Aggregate user fleet by rigId
  const rigCounts = purchases.reduce((acc, p) => {
    acc[p.rigId] = (acc[p.rigId] || 0) + p.quantity;
    return acc;
  }, {} as Record<string, number>);

  const fleetRigs = MINING_RIGS.map((rig) => {
    const count = rigCounts[rig.id] || 0;
    return { rig, count };
  }).filter((item) => item.count > 0);

  const totalRigs = purchases.reduce((acc, p) => acc + p.quantity, 0);

  const totalRawHashrate = fleetRigs.reduce((acc, item) => {
    return acc + item.rig.hashrateRaw * item.count;
  }, 0);

  const formatHashrate = (raw: number) => {
    if (raw >= 1000) return `${(raw / 1000).toFixed(2)} PH/s`;
    return `${raw} TH/s`;
  };

  const totalEthInvested = purchases
    .reduce((acc, p) => acc + parseFloat(p.totalEth), 0)
    .toFixed(4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Fleet Hero & Telemetry Banner */}
      <div className="border border-zinc-800 bg-[#0d0e12] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-500 uppercase tracking-widest mb-1">
              <span className="h-1.5 w-1.5 bg-orange-500" />
              <span>LIVE FLEET TELEMETRY // ONLINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Deployed Hardware Fleet
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Real-time operational parameters and aggregated capacity of your deployed ASIC hashing units.
            </p>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="flex items-center gap-2 self-start md:self-auto bg-orange-600 hover:bg-orange-500 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
          >
            <span>Acquire Nodes</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Aggregate Stats Grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Gauge className="h-3.5 w-3.5 text-orange-500" />
              <span>TOTAL CAPACITY</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {formatHashrate(totalRawHashrate)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Active Network Share
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Server className="h-3.5 w-3.5 text-zinc-400" />
              <span>ACTIVE UNITS</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {totalRigs} <span className="text-xs text-zinc-500">NODES</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              100% OPERATIONAL
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
              <span>EST. DAILY YIELD</span>
            </div>
            <div className="mt-2 text-2xl font-black text-orange-500">
              {(totalRawHashrate * 0.0000041).toFixed(5)}{' '}
              <span className="text-xs">ETH/d</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              ≈ ${((totalRawHashrate * 0.0000041) * 3000).toFixed(2)}/day
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              <span>ETH INVESTED</span>
            </div>
            <div className="mt-2 text-2xl font-black text-white">
              {totalEthInvested}{' '}
              <span className="text-xs text-orange-500">ETH</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              {purchases.length} Orders Succeeded
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Rigs List or Empty State */}
      {fleetRigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-zinc-800 bg-[#0d0e12] p-12 text-center font-mono">
          <div className="flex h-12 w-12 items-center justify-center border border-zinc-800 bg-zinc-950 text-zinc-500">
            <Server className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-white uppercase">
            NO DEPLOYED HARDWARE UNITS
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-md">
            Your fleet is currently empty. Connect your wallet and purchase ASIC mining hardware using ETH to start telemetry hashing.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="mt-6 flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
          >
            <span>Explore Hardware Catalog</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            DEPLOYED MODULES ({fleetRigs.length} MODEL TYPES ACTIVE)
          </div>

          <div className="grid grid-cols-1 gap-4 font-mono">
            {fleetRigs.map(({ rig, count }) => {
              const combinedHash = rig.hashrateRaw * count;
              return (
                <div
                  key={rig.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-800 bg-[#0d0e12] p-5 transition-all hover:border-zinc-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-zinc-800 bg-zinc-900">
                      <Image
                        src={rig.image}
                        alt={rig.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-base font-bold text-white">
                          {rig.name}
                        </h4>
                        <span className="text-xs text-orange-500 uppercase">
                          [{rig.tier}]
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                        <span className="h-1.5 w-1.5 bg-emerald-500" />
                        <span className="text-emerald-400 font-bold">
                          ONLINE // HASHING
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span>{rig.coolingType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase text-zinc-500">
                        DEPLOYED UNITS
                      </div>
                      <div className="text-base font-bold text-white">
                        {count}x NODES
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase text-zinc-500">
                        COMBINED CAPACITY
                      </div>
                      <div className="text-base font-bold text-orange-500">
                        {formatHashrate(combinedHash)}
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-[10px] uppercase text-zinc-500">
                        EST. DAILY YIELD
                      </div>
                      <div className="text-sm font-bold text-white">
                        {(parseFloat(rig.estDailyEth) * count).toFixed(5)} ETH/d
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
