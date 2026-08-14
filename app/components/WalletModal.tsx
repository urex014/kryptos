'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useWeb3 } from '../context/Web3Context';
import {
  X,
  Wallet,
  Smartphone,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Download,
  Shield,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    connect,
    discoveredProviders,
    isConnecting,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState<'detected' | 'mobile' | 'qr' | 'install'>('detected');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobileDevice(mobile);
      setCurrentUrl(window.location.href);

      // Default to mobile tab if on mobile device and no injected wallet found
      if (mobile && discoveredProviders.length === 0 && !(window as any).ethereum) {
        setActiveTab('mobile');
      } else {
        setActiveTab('detected');
      }
    }
  }, [isOpen, discoveredProviders.length]);

  // Generate QR Code when QR tab is active or modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const dappUrl = window.location.href;
      // Generate QR Code targeting universal link or raw URL
      QRCode.toDataURL(
        dappUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (providerDetail?: any) => {
    try {
      await connect(providerDetail);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Mobile App Deep Links
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

  const mobileWallets = [
    {
      name: 'MetaMask Mobile',
      tagline: 'Open directly in MetaMask App',
      icon: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
      bgColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      deepLink: `https://metamask.app.link/dapp/${host}${pathname}`,
      storeUrl: 'https://metamask.io/download/',
    },
    {
      name: 'Trust Wallet',
      tagline: 'Open in Trust Wallet dApp Browser',
      icon: 'https://trustwallet.com/assets/images/media/assets/TWT.svg',
      bgColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      deepLink: `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(fullUrl)}`,
      storeUrl: 'https://trustwallet.com/download',
    },
    {
      name: 'Coinbase Wallet',
      tagline: 'Open in Coinbase Wallet App',
      icon: 'https://raw.githubusercontent.com/rainbow-me/rainbow-button/main/packages/rainbowkit/src/wallets/walletConnectors/coinbaseWallet/coinbaseWallet.svg',
      bgColor: 'bg-blue-600/10 text-blue-300 border-blue-600/30',
      deepLink: `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(fullUrl)}`,
      storeUrl: 'https://www.coinbase.com/wallet',
    },
    {
      name: 'Rainbow Wallet',
      tagline: 'Open in Rainbow iOS / Android',
      icon: 'https://raw.githubusercontent.com/rainbow-me/rainbow-button/main/packages/rainbowkit/src/wallets/walletConnectors/rainbowWallet/rainbowWallet.svg',
      bgColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      deepLink: `https://rnbwapp.com/dapp?url=${encodeURIComponent(fullUrl)}`,
      storeUrl: 'https://rainbow.me/download',
    },
  ];

  const browserExtensions = [
    {
      name: 'MetaMask Extension',
      desc: 'Most widely used Web3 Ethereum wallet extension',
      url: 'https://metamask.io/download/',
      badge: 'Chrome / Brave / Firefox / Edge',
    },
    {
      name: 'Rabby Wallet',
      desc: 'The game-changing Web3 wallet for DeFi & multi-chain',
      url: 'https://rabby.io/',
      badge: 'Chrome / Brave',
    },
    {
      name: 'Coinbase Wallet',
      desc: 'Self-custody extension with passkey and ETH support',
      url: 'https://www.coinbase.com/wallet/downloads',
      badge: 'All Browsers',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-mono">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg border border-zinc-800 bg-[#0d0e12] p-5 sm:p-6 shadow-2xl transition-all max-h-[92vh] flex flex-col justify-between overflow-hidden">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center bg-orange-600 text-black font-black">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-tight">
                  CONNECT WEB3 WALLET
                </h3>
                <p className="text-[11px] text-zinc-500">
                  {isMobileDevice ? 'Mobile App Deep Link & Injected' : 'EVM Multi-Provider & Mobile Gateway'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="mt-4 grid grid-cols-3 gap-1 p-1 border border-zinc-800/80 bg-zinc-950/80 text-xs">
            <button
              onClick={() => setActiveTab('detected')}
              className={`py-1.5 px-2 text-center transition-all cursor-pointer truncate ${
                activeTab === 'detected'
                  ? 'bg-orange-600 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {discoveredProviders.length > 0 ? `DETECTED (${discoveredProviders.length})` : 'EXTENSIONS'}
            </button>

            <button
              onClick={() => setActiveTab('mobile')}
              className={`py-1.5 px-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                activeTab === 'mobile'
                  ? 'bg-orange-600 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-3 w-3 shrink-0" />
              <span>MOBILE APPS</span>
            </button>

            <button
              onClick={() => setActiveTab('qr')}
              className={`py-1.5 px-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1 truncate ${
                activeTab === 'qr'
                  ? 'bg-orange-600 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <QrCode className="h-3 w-3 shrink-0" />
              <span>SCAN QR</span>
            </button>
          </div>

          {/* Tab 1: Injected Extensions */}
          {activeTab === 'detected' && (
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
              {/* EIP-6963 Discovered Wallets */}
              {discoveredProviders.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    INSTALLED EXTENSIONS FOUND
                  </div>
                  {discoveredProviders.map((providerDetail) => (
                    <button
                      key={providerDetail.info.uuid}
                      disabled={isConnecting}
                      onClick={() => handleConnect(providerDetail)}
                      className="group flex w-full items-center justify-between border border-zinc-800 bg-zinc-950 p-3 hover:border-orange-500 hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
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
                          <span className="text-[10px] text-emerald-400 font-bold">
                            READY TO CONNECT
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-orange-500 group-hover:translate-x-0.5 transition-transform">
                        CONNECT &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Standard Injected / Browser Extension trigger */}
                  <button
                    disabled={isConnecting}
                    onClick={() => handleConnect()}
                    className="group flex w-full items-center justify-between border border-zinc-800 bg-zinc-950 p-3.5 hover:border-orange-500 hover:bg-zinc-900 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center bg-orange-600/10 border border-orange-600/30 text-orange-500">
                        <Wallet className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-orange-500 transition-colors">
                          Browser Injected Wallet
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

                  {/* No extension notice & quick guide */}
                  <div className="border border-zinc-800/80 bg-zinc-950/60 p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-orange-400 font-bold">
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>NO WALLET EXTENSION DETECTED?</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      If you are using a mobile browser (Safari, Chrome Mobile) or a desktop without an extension, you can tap <span className="text-white font-bold">MOBILE APPS</span> to open directly in MetaMask/Trust Wallet, or <span className="text-white font-bold">SCAN QR</span> with your phone!
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setActiveTab('mobile')}
                        className="flex-1 border border-orange-500/40 bg-orange-600/10 hover:bg-orange-600/20 py-2 text-[11px] font-bold text-orange-400 transition-colors cursor-pointer text-center"
                      >
                        Launch Mobile App &rarr;
                      </button>
                      <button
                        onClick={() => setActiveTab('qr')}
                        className="flex-1 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-2 text-[11px] text-zinc-300 transition-colors cursor-pointer text-center"
                      >
                        Scan QR Code &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Mobile App Deep Links (For Safari / Chrome on iOS & Android) */}
          {activeTab === 'mobile' && (
            <div className="mt-4 space-y-3 overflow-y-auto max-h-[50vh] pr-1 scrollbar-thin">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                1-TAP OPEN IN MOBILE WEB3 WALLET
              </div>

              <div className="space-y-2">
                {mobileWallets.map((wallet) => (
                  <a
                    key={wallet.name}
                    href={wallet.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-between border border-zinc-800 bg-zinc-950 p-3 hover:border-orange-500 hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-200">
                        <Smartphone className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-white group-hover:text-orange-500 transition-colors">
                          {wallet.name}
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          {wallet.tagline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-orange-500 group-hover:translate-x-0.5 transition-transform font-bold">
                      OPEN &rarr;
                    </span>
                  </a>
                ))}
              </div>

              {/* 1-Tap Copy Link to paste in in-app browser */}
              <div className="pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-2.5 px-3 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-orange-500" />
                      <span className="text-orange-500 font-bold">DAPP LINK COPIED TO CLIPBOARD!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-zinc-400" />
                      <span>COPY DAPP LINK TO PASTE IN WALLET BROWSER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Scan QR Code with Phone Camera or Wallet */}
          {activeTab === 'qr' && (
            <div className="mt-4 flex flex-col items-center justify-center space-y-3 p-3 border border-zinc-800 bg-zinc-950/60 text-center">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                SCAN WITH MOBILE CAMERA OR WALLET
              </div>

              {qrDataUrl ? (
                <div className="p-3 bg-white border border-orange-500/80 shadow-lg">
                  <img
                    src={qrDataUrl}
                    alt="Scan to Connect"
                    className="h-44 w-44 object-contain"
                  />
                </div>
              ) : (
                <div className="h-44 w-44 flex items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-500">
                  Generating QR...
                </div>
              )}

              <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed">
                Scan with your phone's camera to open directly in your mobile Web3 wallet (MetaMask, Trust, or Coinbase).
              </p>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link Manually'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Security & Protocol Footer */}
        <div className="mt-5 pt-3 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>DIRECT EVM HANDSHAKE</span>
          </div>
          <span>ETHEREUM MAINNET • BASE • ARBITRUM</span>
        </div>
      </div>
    </div>
  );
}
