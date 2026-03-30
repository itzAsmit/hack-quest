import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { algorandService } from "@/lib/blockchain/algorand";
import { uploadMetadataToIPFS } from "@/lib/ipfs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nft_ownership_id, wallet_address } = await request.json();

    if (!nft_ownership_id || !wallet_address) {
      return NextResponse.json({ error: "nft_ownership_id and wallet_address required" }, { status: 400 });
    }

    // Verify ownership
    const { data: ownership } = await supabase
      .from("nft_ownership")
      .select("*, nft_definitions(*)")
      .eq("id", nft_ownership_id)
      .eq("owner_id", user.id)
      .single();

    if (!ownership) {
      return NextResponse.json({ error: "NFT not found or not owned by you" }, { status: 404 });
    }

    if (ownership.on_chain_tx) {
      return NextResponse.json({ error: "NFT is already minted on-chain" }, { status: 400 });
    }

    const nftDef = ownership.nft_definitions;

    // Upload metadata to IPFS
    const metadata = algorandService.buildMetadata({
      description: nftDef.description || `HackQuest NFT: ${nftDef.name}`,
      imageUrl: nftDef.image_url,
      rarity: nftDef.rarity_color,
    });

    const ipfsResult = await uploadMetadataToIPFS(metadata as unknown as Record<string, unknown>, `hqnft-${nftDef.name}`);

    if (!ipfsResult.success) {
      return NextResponse.json({ error: "Failed to upload metadata to IPFS" }, { status: 500 });
    }

    // Mint on Algorand
    const tx = await algorandService.createASA({
      metadata,
      creatorAddress: wallet_address,
      totalSupply: 1,
    });

    // Store tx hash on ownership record
    const { error: updateError } = await supabase
      .from("nft_ownership")
      .update({
        on_chain_tx: tx.txHash,
        on_chain_network: "algorand",
        ipfs_metadata_url: ipfsResult.url,
      })
      .eq("id", nft_ownership_id);

    if (updateError) {
      console.error("Failed to update ownership record after mint:", updateError);
      // NFT is minted but DB update failed - return partial success with warning
      return NextResponse.json({
        success: true,
        warning: "NFT minted but database update failed. Please contact support.",
        txHash: tx.txHash,
        chain: "algorand",
        ipfsUrl: ipfsResult.url,
        explorerUrl: algorandService.getExplorerUrl(tx.txHash),
      }, { status: 207 }); // Multi-Status
    }

    // Write audit record on Algorand
    await algorandService.writeAudit({
      eventType: "nft_mint",
      userId: user.id,
      data: {
        nft_name: nftDef.name,
        chain: "algorand",
        txHash: tx.txHash,
        ipfs_cid: ipfsResult.cid,
      },
    });

    // Activity feed
    await supabase.from("activity_feed").insert({
      user_id: user.id,
      activity_type: "nft_mint",
      message: `Minted "${nftDef.name}" on Algorand blockchain`,
      metadata: {
        nft_ownership_id,
        chain: "algorand",
        txHash: tx.txHash,
        ipfsUrl: ipfsResult.url,
      },
      is_public: true,
    });

    return NextResponse.json({
      success: true,
      txHash: tx.txHash,
      chain: "algorand",
      ipfsUrl: ipfsResult.url,
      explorerUrl: algorandService.getExplorerUrl(tx.txHash),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
