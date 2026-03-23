// Blockchain configuration and types for HackQuest

export const SUPPORTED_CHAINS = ["solana", "algorand"] as const;
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

export interface BlockchainConfig {
  solana: {
    rpcUrl: string;
    network: "mainnet-beta" | "devnet" | "testnet";
    explorerUrl: string;
    programId: string | null;
  };
  algorand: {
    algodUrl: string;
    algodToken: string;
    indexerUrl: string;
    network: "mainnet" | "testnet";
    explorerUrl: string;
  };
}

export const blockchainConfig: BlockchainConfig = {
  solana: {
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
    network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as BlockchainConfig["solana"]["network"]) || "devnet",
    explorerUrl: "https://explorer.solana.com",
    programId: process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || null,
  },
  algorand: {
    algodUrl: process.env.NEXT_PUBLIC_ALGORAND_ALGOD_URL || "https://testnet-api.algonode.cloud",
    algodToken: process.env.NEXT_PUBLIC_ALGORAND_ALGOD_TOKEN || "",
    indexerUrl: process.env.NEXT_PUBLIC_ALGORAND_INDEXER_URL || "https://testnet-idx.algonode.cloud",
    network: (process.env.NEXT_PUBLIC_ALGORAND_NETWORK as "mainnet" | "testnet") || "testnet",
    explorerUrl: "https://testnet.explorer.perawallet.app",
  },
};

// NFT metadata standard interfaces
export interface SolanaNFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    category: "image";
    files: Array<{ uri: string; type: string }>;
    creators: Array<{ address: string; share: number }>;
  };
}

export interface AlgorandNFTMetadata {
  standard: "arc69";
  description: string;
  external_url?: string;
  media_url: string;
  mime_type: string;
  properties: Record<string, string | number>;
}

// Transaction types
export interface BlockchainTransaction {
  chain: SupportedChain;
  txHash: string;
  type: "mint" | "transfer" | "audit";
  status: "pending" | "confirmed" | "failed";
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Wallet state
export interface WalletState {
  connected: boolean;
  chain: SupportedChain | null;
  address: string | null;
  balance: number;
}

export function getSolanaExplorerUrl(txHash: string): string {
  const network = blockchainConfig.solana.network;
  const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
  return `${blockchainConfig.solana.explorerUrl}/tx/${txHash}${cluster}`;
}

export function getAlgorandExplorerUrl(txHash: string): string {
  return `${blockchainConfig.algorand.explorerUrl}/tx/${txHash}`;
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
