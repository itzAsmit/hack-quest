"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { GlassPanel } from "@/components/shared/GlassPanel";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-hq-bg-primary flex items-center justify-center p-4">
      <GlassPanel className="max-w-md w-full p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-hq-danger/10 border border-hq-danger/20 mb-4">
          <AlertTriangle className="w-7 h-7 text-hq-danger" />
        </div>
        <h2 className="font-heading font-semibold text-xl text-hq-text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-hq-text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link href="/" className="btn-outline flex items-center gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
