const STABILITY_API_KEY = process.env.STABILITY_API_KEY || "";
const STABILITY_BASE_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";
const MAX_RETRIES = 2;

export type StabilityAspectRatio =
  | "1:1"
  | "16:9"
  | "9:16"
  | "4:5"
  | "5:4"
  | "3:2"
  | "2:3"
  | "21:9"
  | "9:21";

export type StabilityStylePreset =
  | "3d-model"
  | "analog-film"
  | "anime"
  | "cinematic"
  | "comic-book"
  | "digital-art"
  | "enhance"
  | "fantasy-art"
  | "isometric"
  | "line-art"
  | "low-poly"
  | "modeling-compound"
  | "neon-punk"
  | "origami"
  | "photographic"
  | "pixel-art"
  | "tile-texture";

export interface GenerateImageInput {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: StabilityAspectRatio;
  stylePreset?: StabilityStylePreset;
  outputFormat?: "png" | "jpeg" | "webp";
  seed?: number;
}

export interface GenerateImageOutput {
  bytes: ArrayBuffer;
  contentType: string;
  fileExtension: "png" | "jpg" | "webp";
}

export class StabilityApiError extends Error {
  status: number;
  retryAfterSeconds?: number;
  providerMessage?: string;

  constructor(message: string, status: number, retryAfterSeconds?: number, providerMessage?: string) {
    super(message);
    this.name = "StabilityApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
    this.providerMessage = providerMessage;
  }
}

function extensionFromContentType(contentType: string): "png" | "jpg" | "webp" {
  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("webp")) return "webp";
  return "png";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterSeconds(response: Response): number | undefined {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return undefined;
  const parsed = Number(retryAfter);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

async function parseProviderErrorMessage(response: Response): Promise<string> {
  try {
    const json = (await response.json()) as { errors?: string[]; name?: string; message?: string };
    return json.errors?.join(" | ") || json.message || json.name || `Generation failed with status ${response.status}`;
  } catch {
    return `Generation failed with status ${response.status}`;
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function generateImageWithStability(input: GenerateImageInput): Promise<GenerateImageOutput> {
  if (!STABILITY_API_KEY) {
    throw new Error("Missing STABILITY_API_KEY in environment");
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const formData = new FormData();
      formData.append("prompt", input.prompt);
      formData.append("output_format", input.outputFormat || "png");

      if (input.negativePrompt) {
        formData.append("negative_prompt", input.negativePrompt);
      }

      if (input.aspectRatio) {
        formData.append("aspect_ratio", input.aspectRatio);
      }

      if (input.stylePreset) {
        formData.append("style_preset", input.stylePreset);
      }

      if (typeof input.seed === "number" && input.seed > 0) {
        formData.append("seed", String(input.seed));
      }

      const response = await fetch(STABILITY_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      });

      if (response.ok) {
        const bytes = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "image/png";

        return {
          bytes,
          contentType,
          fileExtension: extensionFromContentType(contentType),
        };
      }

      const providerMessage = await parseProviderErrorMessage(response);
      const retryAfterSeconds = parseRetryAfterSeconds(response);
      const retryable = isRetryableStatus(response.status);
      const isFinalAttempt = attempt >= MAX_RETRIES;

      if (retryable && !isFinalAttempt) {
        const backoffMs = retryAfterSeconds
          ? retryAfterSeconds * 1000
          : Math.min(2000 * (attempt + 1), 6000);
        await sleep(backoffMs);
        continue;
      }

      throw new StabilityApiError(
        providerMessage,
        response.status,
        retryAfterSeconds,
        providerMessage
      );
    } catch (error) {
      const isFinalAttempt = attempt >= MAX_RETRIES;

      if (error instanceof StabilityApiError) {
        throw error;
      }

      if (isFinalAttempt) {
        const message = error instanceof Error ? error.message : "Network error while contacting Stability API";
        throw new StabilityApiError(message, 503);
      }

      await sleep(Math.min(1500 * (attempt + 1), 5000));
    }
  }

  throw new StabilityApiError("Failed to generate image", 500);
}
