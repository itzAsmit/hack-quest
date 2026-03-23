export default function Loading() {
  return (
    <div className="min-h-screen bg-hq-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative w-12 h-12 animate-spin-slow">
          <div className="absolute inset-0 bg-gradient-to-br from-hq-accent-purple to-hq-accent-violet rounded-xl transform rotate-45" />
          <div className="absolute inset-[3px] bg-hq-bg-primary rounded-[9px] transform rotate-45" />
          <span className="absolute inset-0 flex items-center justify-center text-hq-accent-glow font-heading font-bold text-lg">
            H
          </span>
        </div>
        <p className="text-sm text-hq-text-muted animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
