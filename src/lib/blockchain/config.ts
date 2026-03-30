// Blockchain configuration and types for HackQuest (Algorand only)

export const SUPPORTED_CHAINS = ["algorand"] as const;
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

export interface BlockchainConfig {
  algorand: {
    algodUrl: string;
    algodToken: string;
    indexerUrl: string;
    network: "mainnet" | "testnet";
    explorerUrl: string;
  };
}

export const blockchainConfig: BlockchainConfig = {
  algorand: {
    algodUrl: process.env.NEXT_PUBLIC_ALGORAND_ALGOD_URL || "https://testnet-api.algonode.cloud",
    algodToken: process.env.NEXT_PUBLIC_ALGORAND_ALGOD_TOKEN || "",
    indexerUrl: process.env.NEXT_PUBLIC_ALGORAND_INDEXER_URL || "https://testnet-idx.algonode.cloud",
    network: (process.env.NEXT_PUBLIC_ALGORAND_NETWORK as "mainnet" | "testnet") || "testnet",
    explorerUrl: "https://testnet.explorer.perawallet.app",
  },
};

// NFT metadata standard interfaces
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

export function getAlgorandExplorerUrl(txHash: string): string {
  return `${blockchainConfig.algorand.explorerUrl}/tx/${txHash}`;
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
