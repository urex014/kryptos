'use client';

import React, { useState } from 'react';
import { MiningRig } from '../config/miningRigs';
import { ThreeRigCardViewer } from './ThreeRigCardViewer';
import {
  Zap,
  Gauge,
  Flame,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface RigCardProps {
  rig: MiningRig;
  onSelectBuy: (rig: MiningRig) => void;
  ownedCount?: number;
}

export function RigCard({ rig, onSelectBuy, ownedCount = 0 }: RigCardProps) {
  const [showSpecs, setShowSpecs] = useState(false);

  const approxUsd = (parseFloat(rig.priceEth) * 3000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="group flex flex-col justify-between border border-zinc-800 bg-[#0d0e12] p-5 transition-all hover:border-orange-500/70">
      <div>
        {/* Top Model ID and Tier */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pb-3 border-b border-zinc-900">
          <span>MODEL // {rig.id.toUpperCase().replace('RIG-', '')}</span>
          <span className="text-orange-500 font-bold uppercase">{rig.tier}</span>
        </div>

        {/* Interactive 3D Model Viewer */}
        <div className="my-4">
          <ThreeRigCardViewer
            modelUrl={rig.modelUrl}
            onlineModelUrl={rig.onlineModelUrl}
            rigName={rig.name}
            tier={rig.tier}
          />
        </div>

        {/* Rig Title and Tagline */}
        <div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {rig.name}
            </h3>
            {ownedCount > 0 && (
              <span className="text-xs font-mono text-emerald-400 font-bold">
                [{ownedCount} DEPLOYED]
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
            {rig.tagline}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="border border-zinc-900 bg-zinc-900/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Gauge className="h-3 w-3 text-orange-500" />
              <span>Hashrate</span>
            </div>
            <div className="mt-1 font-bold text-white text-sm">
              {rig.hashrate}
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <TrendingUp className="h-3 w-3 text-orange-500" />
              <span>Est. Daily</span>
            </div>
            <div className="mt-1 font-bold text-orange-500 text-sm">
              {rig.estDailyEth}/d
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Zap className="h-3 w-3 text-zinc-400" />
              <span>Power Draw</span>
            </div>
            <div className="mt-1 text-zinc-300">
              {rig.powerDraw}
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase">
              <Flame className="h-3 w-3 text-zinc-400" />
              <span>Efficiency</span>
            </div>
            <div className="mt-1 text-zinc-300">
              {rig.efficiency}
            </div>
          </div>
        </div>

        {/* Expandable Hardware Specifications */}
        <div className="mt-3">
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="flex w-full items-center justify-between py-1 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <span>TECH SPECS</span>
            {showSpecs ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showSpecs && (
            <div className="mt-2 space-y-1.5 border border-zinc-900 bg-zinc-950 p-3 text-[11px] font-mono text-zinc-400">
              <div className="flex justify-between">
                <span className="text-zinc-600">CHIPS:</span>
                <span className="text-zinc-300">{rig.specs.chips}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">COOLING:</span>
                <span className="text-zinc-300">{rig.coolingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">DIMENSIONS:</span>
                <span className="text-zinc-300">{rig.specs.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">ACOUSTICS:</span>
                <span className="text-zinc-300">{rig.specs.noiseLevel}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="mt-6 pt-4 border-t border-zinc-900">
        <div className="flex items-baseline justify-between mb-3 font-mono">
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block">
              Node Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">
                {rig.priceEth}
              </span>
              <span className="text-sm font-bold text-orange-500">ETH</span>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-zinc-500">
            ≈ ${approxUsd}
          </div>
        </div>

        <button
          onClick={() => onSelectBuy(rig)}
          className="flex w-full items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
        >
          <span>Purchase with ETH</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
