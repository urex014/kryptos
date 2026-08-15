export interface MiningRig {
  id: string;
  name: string;
  tagline: string;
  priceEth: string; // Easily customizable
  hashrate: string;
  hashrateRaw: number; // in TH/s for calculation
  powerDraw: string;
  efficiency: string;
  estDailyEth: string;
  algorithm: string;
  coolingType: string;
  tier: 'Starter' | 'Pro' | 'Industrial' | 'Datacenter' | 'Apex';
  image: string;
  modelUrl: string;
  onlineModelUrl: string;
  inStock: boolean;
  featured?: boolean;
  specs: {
    chips: string;
    dimensions: string;
    weight: string;
    noiseLevel: string;
  };
}

// 6 mining rigs with distinct specs and customizable pricing
export const MINING_RIGS: MiningRig[] = [
  {
    id: 'rig-nano-x50',
    name: 'Kryptos Nano X-50',
    tagline: 'Ultra-compact silent plug-and-play desktop micro node for entry miners',
    priceEth: '0.0068', // ≈ $20 USD
    hashrate: '45 TH/s',
    hashrateRaw: 45,
    powerDraw: '1,250 W',
    efficiency: '27.8 J/TH',
    estDailyEth: '0.00018 ETH',
    algorithm: 'SHA-256 / Ethash',
    coolingType: 'Whisper-Quiet Dual Fan',
    tier: 'Starter',
    image: '/rigs/rig-1.jpg',
    modelUrl: '/models/cpu_chip.glb',
    onlineModelUrl: 'cpu',
    inStock: true,
    specs: {
      chips: '7nm FinFET x 90',
      dimensions: '320 x 160 x 220 mm',
      weight: '8.5 kg',
      noiseLevel: '48 dB (Ultra-Quiet)',
    },
  },
  {
    id: 'rig-vector-x100',
    name: 'Kryptos Vector X-100',
    tagline: 'High-efficiency balanced home mining unit with active thermal dissipation',
    priceEth: '0.015', // ≈ $45 USD
    hashrate: '110 TH/s',
    hashrateRaw: 110,
    powerDraw: '3,100 W',
    efficiency: '28.2 J/TH',
    estDailyEth: '0.00045 ETH',
    algorithm: 'SHA-256 / Ethash',
    coolingType: 'Dual Honeycomb Air Fan',
    tier: 'Starter',
    image: '/rigs/rig-1.jpg',
    modelUrl: '/models/boombox.glb',
    onlineModelUrl: 'https://threejs.org/examples/models/gltf/BoomBox.glb',
    inStock: true,
    specs: {
      chips: '7nm FinFET x 180',
      dimensions: '400 x 195 x 290 mm',
      weight: '14.2 kg',
      noiseLevel: '65 dB',
    },
  },
  {
    id: 'rig-forge-s300',
    name: 'Kryptos Forge S-300',
    tagline: 'High-throughput dual-chamber rig with copper heat pipes & telemetry LCD',
    priceEth: '0.045', // ≈ $135 USD
    hashrate: '315 TH/s',
    hashrateRaw: 315,
    powerDraw: '4,850 W',
    efficiency: '22.5 J/TH',
    estDailyEth: '0.00135 ETH',
    algorithm: 'SHA-256',
    coolingType: 'Dual-Chamber Copper Heatpipe',
    tier: 'Pro',
    image: '/rigs/rig-2.jpg',
    modelUrl: '/models/damaged_helmet.glb',
    onlineModelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    inStock: true,
    featured: true,
    specs: {
      chips: '5nm High-Density x 256',
      dimensions: '480 x 220 x 340 mm',
      weight: '18.5 kg',
      noiseLevel: '72 dB',
    },
  },
  {
    id: 'rig-hydro-6000',
    name: 'Kryptos Hydro-6000',
    tagline: 'Industrial closed-loop liquid cooled server for continuous high-load mining',
    priceEth: '0.12', // ≈ $360 USD
    hashrate: '780 TH/s',
    hashrateRaw: 780,
    powerDraw: '6,200 W',
    efficiency: '17.4 J/TH',
    estDailyEth: '0.0039 ETH',
    algorithm: 'SHA-256 / Scrypt',
    coolingType: 'Triple-Rad Closed Liquid Loop',
    tier: 'Industrial',
    image: '/rigs/rig-3.jpg',
    modelUrl: '/models/ion_drive.glb',
    onlineModelUrl: 'https://threejs.org/examples/models/gltf/PrimaryIonDrive.glb',
    inStock: true,
    specs: {
      chips: '4nm Cryo-Enhanced x 384',
      dimensions: '520 x 280 x 410 mm',
      weight: '26.8 kg',
      noiseLevel: '58 dB',
    },
  },
  {
    id: 'rig-quantum-blade',
    name: 'Kryptos QuantumBlade-H6',
    tagline: 'Multi-module rack-mounted blade system with optical status telemetry',
    priceEth: '0.35', // ≈ $1,050 USD
    hashrate: '2.4 PH/s',
    hashrateRaw: 2400,
    powerDraw: '9,400 W',
    efficiency: '13.1 J/TH',
    estDailyEth: '0.0118 ETH',
    algorithm: 'Multi-Algorithm Hash Matrix',
    coolingType: 'Direct-to-Chip Active Manifold',
    tier: 'Datacenter',
    image: '/rigs/rig-4.jpg',
    modelUrl: '/models/steampunk_camera.glb',
    onlineModelUrl: 'https://threejs.org/examples/models/gltf/steampunk_camera.glb',
    inStock: true,
    specs: {
      chips: '3nm Quantum Die Matrix x 720',
      dimensions: '4U 19-inch Rack Mount',
      weight: '38.0 kg',
      noiseLevel: '68 dB',
    },
  },
  {
    id: 'rig-apex-hyperion',
    name: 'Kryptos Apex Hyperion-9000',
    tagline: 'Sovereign-tier dielectric immersion mining powerhouse with microsecond sync',
    priceEth: '0.85', // ≈ $2,550 USD
    hashrate: '6.8 PH/s',
    hashrateRaw: 6800,
    powerDraw: '18,500 W',
    efficiency: '9.8 J/TH',
    estDailyEth: '0.0345 ETH',
    algorithm: 'Omni-Hash HyperCluster',
    coolingType: 'Full Immersion Dielectric Chamber',
    tier: 'Apex',
    image: '/rigs/rig-5.jpg',
    modelUrl: '/models/shaderball.glb',
    onlineModelUrl: 'https://threejs.org/examples/models/gltf/ShaderBall.glb',
    inStock: true,
    featured: true,
    specs: {
      chips: 'Next-Gen 2nm Dielectric Nodes x 1,536',
      dimensions: '650 x 580 x 780 mm',
      weight: '74.5 kg',
      noiseLevel: '42 dB (Immersion)',
    },
  },
];

// Recipient wallet address where ETH payments will be forwarded
// Defaults to a standard treasury address; can be overridden via NEXT_PUBLIC_TREASURY_ADDRESS
export const DEFAULT_TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ||
  '0x503f7e56a252A6aE74E6C48312D46B44e1c794a5';

// Supported chains configuration
export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorers: {
    name: string;
    url: string;
  };
  testnet?: boolean;
}

export const SUPPORTED_CHAINS: Record<number, ChainConfig> = {
  /*
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    network: 'sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org', 'https://sepolia.drpc.org'],
    blockExplorers: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
    testnet: true,
  },
  */
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    network: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.drpc.org', 'https://cloudflare-eth.com'],
    blockExplorers: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  8453: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorers: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    network: 'arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorers: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
};

export const DEFAULT_CHAIN_ID = 1; // Ethereum Mainnet
