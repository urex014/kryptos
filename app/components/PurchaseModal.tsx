'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MiningRig, SUPPORTED_CHAINS, DEFAULT_CHAIN_ID } from '../config/miningRigs';
import { useWeb3, TxStep } from '../context/Web3Context';
import {
  X,
  Plus,
  Minus,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  rig: MiningRig | null;
  onOpenWalletModal: () => void;
  onNavigateToFleet: () => void;
}

export function PurchaseModal({
  isOpen,
  onClose,
  rig,
  onOpenWalletModal,
  onNavigateToFleet,
}: PurchaseModalProps) {
  const {
    address,
    chainId,
    balanceEth,
    isConnected,
    treasuryAddress,
    sendPayment,
  } = useWeb3();

  const [quantity, setQuantity] = useState(1);
  const [txStep, setTxStep] = useState<TxStep>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !rig) return null;

  const currentChain = chainId ? SUPPORTED_CHAINS[chainId] : SUPPORTED_CHAINS[DEFAULT_CHAIN_ID];
  const unitPrice = parseFloat(rig.priceEth);
  const totalPrice = (unitPrice * quantity).toFixed(4);
  const estGas = '0.0008';
  const totalWithGas = (parseFloat(totalPrice) + parseFloat(estGas)).toFixed(4);
  const userBalance = parseFloat(balanceEth || '0');
  const hasSufficientBalance = userBalance >= parseFloat(totalPrice);

  const approxUsd = (parseFloat(totalPrice) * 3000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleBuy = async () => {
    if (!isConnected) {
      onOpenWalletModal();
      return;
    }

    setTxStep('awaiting_approval');
    setErrorMessage(null);
    setTxHash(null);

    const result = await sendPayment({
      rigId: rig.id,
      rigName: rig.name,
      quantity,
      amountEth: totalPrice,
      onProgress: (step, hash, err) => {
        setTxStep(step);
        if (hash) setTxHash(hash);
        if (err) setErrorMessage(err);
      },
    });

    if (result.success && result.hash) {
      setTxHash(result.hash);
      setTxStep('success');
    } else if (result.error) {
      setErrorMessage(result.error);
      setTxStep('error');
    }
  };

  const resetAndClose = () => {
    setTxStep('idle');
    setTxHash(null);
    setErrorMessage(null);
    setQuantity(1);
    onClose();
  };

  const explorerUrl = txHash && currentChain?.blockExplorers?.url
    ? `${currentChain.blockExplorers.url}/tx/${txHash}`
    : `https://sepolia.etherscan.io/tx/${txHash}`;

  const truncate = (str: string) => `${str.slice(0, 8)}...${str.slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={txStep === 'pending' || txStep === 'awaiting_approval' ? undefined : resetAndClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg border border-zinc-800 bg-[#0d0e12] p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 font-mono">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-orange-600 text-black font-black">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase">
                {txStep === 'success' ? 'ORDER RECEIPT' : 'HARDWARE CHECKOUT'}
              </h3>
              <p className="text-[11px] text-zinc-500">
                NETWORK // {currentChain?.name.toUpperCase()}
              </p>
            </div>
          </div>
          {txStep !== 'pending' && txStep !== 'awaiting_approval' && (
            <button
              onClick={resetAndClose}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* ================= STAGE: IDLE (Configure & Buy) ================= */}
        {txStep === 'idle' && (
          <div className="mt-5 space-y-4 font-mono text-xs">
            {/* Rig Preview Card */}
            <div className="flex items-center gap-4 border border-zinc-800 bg-zinc-950 p-3.5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-zinc-800 bg-zinc-900">
                <Image
                  src={rig.image}
                  alt={rig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm truncate">
                    {rig.name}
                  </h4>
                  <span className="text-[10px] text-orange-500 uppercase">
                    [{rig.tier}]
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-zinc-400">
                  <span>{rig.hashrate}</span>
                  <span>•</span>
                  <span className="text-orange-500">{rig.estDailyEth}/d</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-sm">
                  {rig.priceEth} ETH
                </div>
                <div className="text-[10px] text-zinc-500">per unit</div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="border border-zinc-800 bg-zinc-950 p-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 uppercase text-[11px]">
                  SELECT QUANTITY
                </span>
                <span className="text-zinc-500 text-[11px]">
                  MAX: 20 NODES
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-base text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 20}
                    className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-zinc-500 text-[10px] uppercase">
                    Combined Capacity
                  </div>
                  <div className="font-bold text-sm text-orange-500">
                    {rig.hashrateRaw * quantity >= 1000
                      ? `${(rig.hashrateRaw * quantity / 1000).toFixed(1)} PH/s`
                      : `${rig.hashrateRaw * quantity} TH/s`}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-2 border border-zinc-800 bg-zinc-950 p-3.5">
              <div className="flex justify-between text-zinc-400">
                <span>SUBTOTAL:</span>
                <span className="text-white">{totalPrice} ETH</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>EST. NETWORK GAS:</span>
                <span className="text-zinc-500">~{estGas} ETH</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>TREASURY RECIPIENT:</span>
                <span className="text-zinc-400 truncate max-w-[200px]" title={treasuryAddress}>
                  {truncate(treasuryAddress)}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline font-bold">
                <span className="text-white">TOTAL PAYABLE:</span>
                <div className="text-right">
                  <span className="text-base text-orange-500">{totalPrice} ETH</span>
                  <div className="text-[10px] font-normal text-zinc-500">
                    ≈ ${approxUsd} USD
                  </div>
                </div>
              </div>
            </div>

            {/* Balance check & Warnings */}
            {isConnected ? (
              <div className="flex items-center justify-between border border-zinc-800 bg-zinc-950 px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Wallet className="h-3.5 w-3.5 text-orange-500" />
                  <span>WALLET BALANCE:</span>
                </div>
                <span
                  className={`font-bold ${
                    hasSufficientBalance ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {balanceEth || '0.0000'} ETH
                </span>
              </div>
            ) : null}

            {!isConnected ? (
              <button
                onClick={onOpenWalletModal}
                className="flex w-full items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet to Pay</span>
              </button>
            ) : !hasSufficientBalance ? (
              <div className="space-y-2">
                <div className="flex items-start gap-2 border border-red-500/30 bg-red-950/20 p-3 text-red-300">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span>Insufficient balance. Required: </span>
                    <span className="font-bold">{totalPrice} ETH</span>
                    <span>, Available: </span>
                    <span className="font-bold">{balanceEth || '0'} ETH</span>.
                  </div>
                </div>
                <button
                  disabled
                  className="flex w-full items-center justify-center border border-zinc-800 bg-zinc-900 py-3 text-xs font-bold text-zinc-600 uppercase cursor-not-allowed"
                >
                  <span>Insufficient Balance</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleBuy}
                className="flex w-full items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
              >
                <span>Confirm & Pay {totalPrice} ETH</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}

        {/* ================= STAGE: AWAITING APPROVAL ================= */}
        {txStep === 'awaiting_approval' && (
          <div className="my-8 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <div className="flex h-14 w-14 items-center justify-center border border-orange-600 bg-orange-600/10 text-orange-500">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">
                Confirm Transaction in Wallet
              </h4>
              <p className="mt-1 max-w-xs text-xs text-zinc-400">
                Please check your browser extension and approve the transfer of{' '}
                <span className="text-orange-500 font-bold">{totalPrice} ETH</span>.
              </p>
            </div>
            <div className="border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-[11px] text-zinc-500">
              STATE // WAITING_SIGNATURE
            </div>
          </div>
        )}

        {/* ================= STAGE: BROADCASTED & PENDING ================= */}
        {txStep === 'pending' && (
          <div className="my-8 flex flex-col items-center justify-center text-center space-y-4 font-mono">
            <div className="flex h-14 w-14 items-center justify-center border border-orange-600 bg-orange-600/10 text-orange-500">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase">
                Broadcasting to Chain
              </h4>
              <p className="mt-1 max-w-xs text-xs text-zinc-400">
                Transaction sent to mempool. Awaiting block inclusion and receipt confirmation.
              </p>
            </div>

            {txHash && (
              <div className="w-full border border-zinc-800 bg-zinc-950 p-3 space-y-1 text-left">
                <div className="text-[10px] text-zinc-500 uppercase">
                  Transaction Hash
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-300">
                  <span>{truncate(txHash)}</span>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-orange-500 hover:text-orange-400"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STAGE: SUCCESS ================= */}
        {txStep === 'success' && (
          <div className="my-6 space-y-5 font-mono">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-14 w-14 items-center justify-center border border-emerald-500 bg-emerald-950/40 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-white uppercase">
                Node Deployed Successfully
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm">
                Payment of <span className="text-orange-500 font-bold">{totalPrice} ETH</span> verified on-chain.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>HARDWARE:</span>
                <span className="text-white font-bold">{rig.name}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>UNITS:</span>
                <span className="text-white">{quantity}x</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>HASHRATE:</span>
                <span className="text-orange-500 font-bold">
                  {rig.hashrateRaw * quantity >= 1000
                    ? `${(rig.hashrateRaw * quantity / 1000).toFixed(1)} PH/s`
                    : `${rig.hashrateRaw * quantity} TH/s`}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>SETTLED:</span>
                <span className="text-white font-bold">{totalPrice} ETH</span>
              </div>
              {txHash && (
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-zinc-400">
                  <span>TX HASH:</span>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-orange-500 hover:text-orange-400"
                  >
                    <span>{truncate(txHash)}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  resetAndClose();
                  onNavigateToFleet();
                }}
                className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 py-3 text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>View My Fleet</span>
              </button>
              <button
                onClick={resetAndClose}
                className="flex items-center justify-center border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 py-3 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
              >
                <span>Back to Store</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STAGE: ERROR ================= */}
        {txStep === 'error' && (
          <div className="my-6 space-y-4 font-mono">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center border border-red-500 bg-red-950/30 text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">
                Payment Failed
              </h4>
              <p className="text-xs text-red-400 max-w-sm">
                {errorMessage || 'Transaction could not be executed.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleBuy}
                className="flex items-center justify-center bg-orange-600 hover:bg-orange-500 py-3 text-xs font-bold uppercase text-black transition-colors cursor-pointer"
              >
                <span>Try Again</span>
              </button>
              <button
                onClick={resetAndClose}
                className="flex items-center justify-center border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 py-3 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
