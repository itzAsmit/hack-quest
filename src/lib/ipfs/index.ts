/**
 * IPFS integration for HackQuest NFT metadata storage.
 * 
 * Uses Pinata SDK for uploading NFT images and metadata to IPFS.
 * 
 * NOTE: Full IPFS integration requires installing:
 *   npm install pinata-web3
 * And setting env vars:
 *   NEXT_PUBLIC_PINATA_JWT
 *   NEXT_PUBLIC_PINATA_GATEWAY
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "";
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";

export interface IPFSUploadResult {
  success: boolean;
  cid: string;
  url: string;
  size?: number;
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadMetadataToIPFS(
  metadata: Record<string, unknown>,
  name: string
): Promise<IPFSUploadResult> {
  if (!PINATA_JWT) {
    // Simulate upload if no JWT configured
    const mockCid = `Qm${Math.random().toString(36).slice(2, 48).padEnd(44, "0")}`;
    return {
      success: true,
      cid: mockCid,
      url: `${PINATA_GATEWAY}/ipfs/${mockCid}`,
    };
  }

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: { name },
      }),
    });

    const data = await res.json();

    if (data.IpfsHash) {
      return {
        success: true,
        cid: data.IpfsHash,
        url: `${PINATA_GATEWAY}/ipfs/${data.IpfsHash}`,
        size: data.PinSize,
      };
    }

    throw new Error(data.error || "Upload failed");
  } catch (err) {
    console.error("IPFS upload failed:", err);
    return { success: false, cid: "", url: "" };
  }
}

/**
 * Upload file to IPFS via Pinata
 */
export async function uploadFileToIPFS(
  file: File,
  name: string
): Promise<IPFSUploadResult> {
  if (!PINATA_JWT) {
    const mockCid = `Qm${Math.random().toString(36).slice(2, 48).padEnd(44, "0")}`;
    return {
      success: true,
      cid: mockCid,
      url: `${PINATA_GATEWAY}/ipfs/${mockCid}`,
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "pinataMetadata",
      JSON.stringify({ name })
    );

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (data.IpfsHash) {
      return {
        success: true,
        cid: data.IpfsHash,
        url: `${PINATA_GATEWAY}/ipfs/${data.IpfsHash}`,
        size: data.PinSize,
      };
    }

    throw new Error(data.error || "Upload failed");
  } catch (err) {
    console.error("IPFS file upload failed:", err);
    return { success: false, cid: "", url: "" };
  }
}

/**
 * Get IPFS gateway URL from CID
 */
export function getIPFSUrl(cid: string): string {
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
}
