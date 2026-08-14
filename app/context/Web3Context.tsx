'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  createPublicClient,
  createWalletClient,
  custom,
  formatEther,
  http,
  parseEther,
  type Address,
  type Hash,
  type TransactionReceipt,
} from 'viem';
import { mainnet, sepolia, base, arbitrum } from 'viem/chains';
import {
  SUPPORTED_CHAINS,
  DEFAULT_CHAIN_ID,
  DEFAULT_TREASURY_ADDRESS,
} from '../config/miningRigs';

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

export interface PurchaseRecord {
  id: string;
  rigId: string;
  rigName: string;
  quantity: number;
  totalEth: string;
  txHash: string;
  timestamp: number;
  recipient: string;
  chainId: number;
  status: 'confirmed' | 'simulated';
}

export type TxStep =
  | 'idle'
  | 'awaiting_approval'
  | 'pending'
  | 'success'
  | 'error';

interface Web3ContextType {
  address: string | null;
  chainId: number | null;
  balanceEth: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletName: string | null;
  walletIcon: string | null;
  isDemoWallet: boolean;
  discoveredProviders: EIP6963ProviderDetail[];
  treasuryAddress: string;
  setTreasuryAddress: (addr: string) => void;
  purchases: PurchaseRecord[];
  
  // Connection actions
  connect: (providerDetail?: EIP6963ProviderDetail) => Promise<void>;
  connectDemoWallet: () => void;
  disconnect: () => void;
  switchNetwork: (targetChainId: number) => Promise<boolean>;
  refreshBalance: () => Promise<void>;

  // Payment action
  sendPayment: (params: {
    rigId: string;
    rigName: string;
    quantity: number;
    amountEth: string;
    onProgress?: (step: TxStep, txHash?: string, error?: string) => void;
  }) => Promise<{ success: boolean; hash?: string; error?: string }>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

const VIEM_CHAINS: Record<number, any> = {
  11155111: sepolia,
  1: mainnet,
  8453: base,
  42161: arbitrum,
};

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [walletIcon, setWalletIcon] = useState<string | null>(null);
  const [isDemoWallet, setIsDemoWallet] = useState(false);
  const [activeProvider, setActiveProvider] = useState<any>(null);
  const [discoveredProviders, setDiscoveredProviders] = useState<
    EIP6963ProviderDetail[]
  >([]);
  const [treasuryAddress, setTreasuryAddressState] = useState<string>(
    DEFAULT_TREASURY_ADDRESS
  );
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);

  // Load custom treasury & persisted purchases on mount
  useEffect(() => {
    try {
      const savedTreasury = localStorage.getItem('mining_rig_treasury');
      if (savedTreasury) setTreasuryAddressState(savedTreasury);

      const savedPurchases = localStorage.getItem('mining_rig_purchases');
      if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  const setTreasuryAddress = (addr: string) => {
    setTreasuryAddressState(addr);
    try {
      localStorage.setItem('mining_rig_treasury', addr);
    } catch (e) {
      console.error(e);
    }
  };

  // EIP-6963 discovery
  useEffect(() => {
    const handleAnnouncement = (event: any) => {
      if (event.detail) {
        setDiscoveredProviders((prev) => {
          const exists = prev.some(
            (p) => p.info.uuid === event.detail.info.uuid
          );
          if (exists) return prev;
          return [...prev, event.detail];
        });
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnouncement);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener(
        'eip6963:announceProvider',
        handleAnnouncement
      );
    };
  }, []);

  // Fetch balance function
  const fetchBalance = useCallback(
    async (acc: string, currentChainId: number) => {
      if (isDemoWallet) {
        return; // Demo balance managed locally
      }
      try {
        const viemChain = VIEM_CHAINS[currentChainId] || mainnet;
        const client = createPublicClient({
          chain: viemChain,
          transport: http(),
        });
        const bal = await client.getBalance({ address: acc as Address });
        setBalanceEth(Number(formatEther(bal)).toFixed(4));
      } catch (err) {
        console.warn('Balance fetch error, attempting fallback RPC:', err);
        // Fallback to active provider
        if (activeProvider) {
          try {
            const rawBal = await activeProvider.request({
              method: 'eth_getBalance',
              params: [acc, 'latest'],
            });
            const parsed = BigInt(rawBal);
            setBalanceEth(Number(formatEther(parsed)).toFixed(4));
          } catch (innerErr) {
            console.error('Could not fetch balance', innerErr);
          }
        }
      }
    },
    [isDemoWallet, activeProvider]
  );

  const refreshBalance = useCallback(async () => {
    if (address && chainId) {
      await fetchBalance(address, chainId);
    }
  }, [address, chainId, fetchBalance]);

  // Connect to real wallet
  const connect = async (providerDetail?: EIP6963ProviderDetail) => {
    setIsConnecting(true);
    try {
      let rawProvider: any = null;
      let name = 'Injected Wallet';
      let icon: string | null = null;

      if (providerDetail) {
        rawProvider = providerDetail.provider;
        name = providerDetail.info.name;
        icon = providerDetail.info.icon;
      } else if (typeof window !== 'undefined' && (window as any).ethereum) {
        rawProvider = (window as any).ethereum;
        if (rawProvider.isMetaMask) name = 'MetaMask';
        else if (rawProvider.isCoinbaseWallet) name = 'Coinbase Wallet';
        else if (rawProvider.isRabby) name = 'Rabby Wallet';
        else if (rawProvider.isBraveWallet) name = 'Brave Wallet';
      }

      if (!rawProvider) {
        throw new Error(
          'No Ethereum wallet extension detected. Please install MetaMask, Rabby, Coinbase Wallet, or another Web3 extension.'
        );
      }

      const accounts = await rawProvider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts selected');
      }

      const hexChainId = await rawProvider.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(hexChainId, 16);

      setActiveProvider(rawProvider);
      setAddress(accounts[0]);
      setChainId(currentChainId);
      setWalletName(name);
      setWalletIcon(icon);
      setIsDemoWallet(false);

      await fetchBalance(accounts[0], currentChainId);

      // Listen for account/chain changes
      if (rawProvider.on) {
        rawProvider.on('accountsChanged', (newAccounts: string[]) => {
          if (newAccounts.length === 0) {
            disconnect();
          } else {
            setAddress(newAccounts[0]);
            fetchBalance(newAccounts[0], currentChainId);
          }
        });

        rawProvider.on('chainChanged', (newHexChainId: string) => {
          const newChain = parseInt(newHexChainId, 16);
          setChainId(newChain);
          if (accounts[0]) fetchBalance(accounts[0], newChain);
        });
      }
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect mock demo wallet for instant testing
  const connectDemoWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockAddr = '0x8b31A382834bA83a6bF9d17dF0a93f77395e802B';
      setAddress(mockAddr);
      setChainId(11155111); // Sepolia
      setBalanceEth('5.4250');
      setWalletName('Demo Test Wallet');
      setWalletIcon(null);
      setIsDemoWallet(true);
      setActiveProvider(null);
      setIsConnecting(false);
    }, 400);
  };

  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setBalanceEth(null);
    setWalletName(null);
    setWalletIcon(null);
    setIsDemoWallet(false);
    setActiveProvider(null);
  };

  // Switch network
  const switchNetwork = async (targetChainId: number): Promise<boolean> => {
    if (isDemoWallet) {
      setChainId(targetChainId);
      return true;
    }

    if (!activeProvider) return false;

    const hexChainId = `0x${targetChainId.toString(16)}`;
    try {
      await activeProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
      return true;
    } catch (switchError: any) {
      // Error code 4902 indicates that the chain has not been added yet
      if (switchError.code === 4902 || switchError?.data?.originalError?.code === 4902) {
        const chainConfig = SUPPORTED_CHAINS[targetChainId];
        if (chainConfig) {
          try {
            await activeProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: hexChainId,
                  chainName: chainConfig.name,
                  nativeCurrency: chainConfig.nativeCurrency,
                  rpcUrls: chainConfig.rpcUrls,
                  blockExplorerUrls: [chainConfig.blockExplorers.url],
                },
              ],
            });
            return true;
          } catch (addError) {
            console.error('Failed to add chain', addError);
            return false;
          }
        }
      }
      console.error('Failed to switch network', switchError);
      return false;
    }
  };

  // Send payment
  const sendPayment = async ({
    rigId,
    rigName,
    quantity,
    amountEth,
    onProgress,
  }: {
    rigId: string;
    rigName: string;
    quantity: number;
    amountEth: string;
    onProgress?: (step: TxStep, txHash?: string, error?: string) => void;
  }): Promise<{ success: boolean; hash?: string; error?: string }> => {
    if (!address) {
      onProgress?.('error', undefined, 'Wallet not connected');
      return { success: false, error: 'Wallet not connected' };
    }

    onProgress?.('awaiting_approval');

    // Handle Demo Wallet Simulation
    if (isDemoWallet) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const simulatedHash = `0x${Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join('')}`;

          onProgress?.('pending', simulatedHash);

          setTimeout(() => {
            // Deduct mock balance
            const cur = parseFloat(balanceEth || '5.0');
            const total = parseFloat(amountEth);
            if (cur < total) {
              onProgress?.('error', undefined, 'Insufficient mock balance');
              resolve({ success: false, error: 'Insufficient mock balance' });
              return;
            }

            setBalanceEth(Math.max(0, cur - total).toFixed(4));

            const record: PurchaseRecord = {
              id: `pur_${Date.now()}`,
              rigId,
              rigName,
              quantity,
              totalEth: amountEth,
              txHash: simulatedHash,
              timestamp: Date.now(),
              recipient: treasuryAddress,
              chainId: chainId || DEFAULT_CHAIN_ID,
              status: 'simulated',
            };

            const updatedPurchases = [record, ...purchases];
            setPurchases(updatedPurchases);
            try {
              localStorage.setItem(
                'mining_rig_purchases',
                JSON.stringify(updatedPurchases)
              );
            } catch (e) {
              console.error(e);
            }

            onProgress?.('success', simulatedHash);
            resolve({ success: true, hash: simulatedHash });
          }, 2000);
        }, 1200);
      });
    }

    // Real on-chain payment via Viem & active provider
    try {
      if (!activeProvider) {
        throw new Error('Wallet provider disconnected');
      }

      const viemChain = VIEM_CHAINS[chainId || DEFAULT_CHAIN_ID] || mainnet;

      const publicClient = createPublicClient({
        chain: viemChain,
        transport: custom(activeProvider),
      });

      const valueWei = parseEther(amountEth);
      const hexValue = `0x${valueWei.toString(16)}`;

      let hash: Hash;

      try {
        const walletClient = createWalletClient({
          account: address as Address,
          chain: viemChain,
          transport: custom(activeProvider),
        });

        hash = await walletClient.sendTransaction({
          account: address as Address,
          to: treasuryAddress as Address,
          value: valueWei,
          chain: viemChain,
        });
      } catch (wcErr) {
        // Fallback to direct JSON-RPC eth_sendTransaction
        const rawHash = await activeProvider.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: address,
              to: treasuryAddress,
              value: hexValue,
            },
          ],
        });
        hash = rawHash as Hash;
      }

      onProgress?.('pending', hash);

      // Wait for block confirmation
      const receipt: TransactionReceipt =
        await publicClient.waitForTransactionReceipt({
          hash,
        });

      if (receipt.status === 'success') {
        const record: PurchaseRecord = {
          id: `pur_${Date.now()}`,
          rigId,
          rigName,
          quantity,
          totalEth: amountEth,
          txHash: hash,
          timestamp: Date.now(),
          recipient: treasuryAddress,
          chainId: chainId || DEFAULT_CHAIN_ID,
          status: 'confirmed',
        };

        const updatedPurchases = [record, ...purchases];
        setPurchases(updatedPurchases);
        try {
          localStorage.setItem(
            'mining_rig_purchases',
            JSON.stringify(updatedPurchases)
          );
        } catch (e) {
          console.error(e);
        }

        // Refresh live balance
        await fetchBalance(address, chainId || DEFAULT_CHAIN_ID);

        onProgress?.('success', hash);
        return { success: true, hash };
      } else {
        throw new Error('Transaction reverted on-chain');
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      let errorMsg = 'Payment failed. Please try again.';

      if (err.code === 4001 || err?.message?.includes('User rejected')) {
        errorMsg = 'Transaction rejected in wallet.';
      } else if (
        err?.message?.includes('insufficient funds') ||
        err?.message?.includes('exceeds balance')
      ) {
        errorMsg = 'Insufficient ETH in wallet to cover price and gas fees.';
      } else if (err.message) {
        errorMsg = err.message.slice(0, 120);
      }

      onProgress?.('error', undefined, errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        chainId,
        balanceEth,
        isConnected: !!address,
        isConnecting,
        walletName,
        walletIcon,
        isDemoWallet,
        discoveredProviders,
        treasuryAddress,
        setTreasuryAddress,
        purchases,
        connect,
        connectDemoWallet,
        disconnect,
        switchNetwork,
        refreshBalance,
        sendPayment,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
