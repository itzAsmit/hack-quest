/**
 * Solana blockchain integration for HackQuest NFT minting.
 * 
 * Uses @solana/web3.js for on-chain interactions.
 * This module provides NFT minting, transfer, and metadata utilities.
 * 
 * NOTE: Full Solana integration requires installing:
 *   npm install @solana/web3.js @metaplex-foundation/js
 * 
 * For now, this provides a simulated interface that records transactions
 * in Supabase and can be swapped for real on-chain calls later.
 */

import { blockchainConfig, getSolanaExplorerUrl } from "./config";
import type { SolanaNFTMetadata, BlockchainTransaction } from "./config";

// Simulated Solana interface that records transactions for future on-chain migration
export class SolanaService {
  private rpcUrl: string;
  private network: string;

  constructor() {
    this.rpcUrl = blockchainConfig.solana.rpcUrl;
    this.network = blockchainConfig.solana.network;
  }

  /**
   * Mint an NFT to the connected wallet.
   * In production, this connects to a Solana program to create a Metaplex NFT.
   * Currently simulates by generating a mock transaction hash.
   */
  async mintNFT(params: {
    metadata: SolanaNFTMetadata;
    recipientAddress: string;
    ipfsUri: string;
  }): Promise<BlockchainTransaction> {
    // Simulate minting delay
    await new Promise((r) => setTimeout(r, 2000));

    const mockTxHash = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    return {
      chain: "solana",
      txHash: mockTxHash,
      type: "mint",
      status: "confirmed",
      timestamp: new Date().toISOString(),
      metadata: {
        name: params.metadata.name,
        recipientAddress: params.recipientAddress,
        ipfsUri: params.ipfsUri,
        network: this.network,
      },
    };
  }

  /**
   * Transfer an NFT between wallets.
   */
  async transferNFT(params: {
    mintAddress: string;
    fromAddress: string;
    toAddress: string;
  }): Promise<BlockchainTransaction> {
    await new Promise((r) => setTimeout(r, 1500));

    const mockTxHash = `sim_tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    return {
      chain: "solana",
      txHash: mockTxHash,
      type: "transfer",
      status: "confirmed",
      timestamp: new Date().toISOString(),
      metadata: {
        mintAddress: params.mintAddress,
        from: params.fromAddress,
        to: params.toAddress,
        network: this.network,
      },
    };
  }

  /**
   * Get the explorer URL for a transaction
   */
  getExplorerUrl(txHash: string): string {
    return getSolanaExplorerUrl(txHash);
  }

  /**
   * Build Metaplex-compatible NFT metadata
   */
  buildMetadata(params: {
    name: string;
    description: string;
    imageUrl: string;
    rarity: string;
    eventName?: string;
    creatorAddress: string;
  }): SolanaNFTMetadata {
    return {
      name: params.name,
      symbol: "HQNFT",
      description: params.description,
      image: params.imageUrl,
      external_url: "https://hackquest.dev",
      attributes: [
        { trait_type: "Rarity", value: params.rarity },
        { trait_type: "Platform", value: "HackQuest" },
        ...(params.eventName
          ? [{ trait_type: "Event", value: params.eventName }]
          : []),
      ],
      properties: {
        category: "image",
        files: [{ uri: params.imageUrl, type: "image/png" }],
        creators: [{ address: params.creatorAddress, share: 100 }],
      },
    };
  }
}

export const solanaService = new SolanaService();
