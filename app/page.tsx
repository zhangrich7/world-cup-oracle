import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon/30 bg-neon/10 text-neon text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon" />
          </span>
          FIFA World Cup 2026 — Live Now
        </div>

        {/* Hero */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
          <span className="text-zinc-100">AI World Cup</span>
          <br />
          <span className="text-neon">Prediction Oracle</span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed">
          Pick a match. Choose your side. Let DeepSeek AI predict the outcome.
          Share a premium cyberpunk card on X, Instagram, TikTok, or Reddit.
        </p>

        {/* CTA */}
        <Link
          href="/generate"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-neon text-black font-bold text-lg rounded-lg hover:bg-neon/90 transition-all duration-200 shadow-[0_0_30px_rgba(0,255,170,0.3)] hover:shadow-[0_0_50px_rgba(0,255,170,0.5)]"
        >
          Generate Your Prediction Card
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </Link>

        <p className="mt-4 text-xs text-zinc-600">
          Free to use ·{" "}
          <Link href="/pricing" className="text-neon/70 hover:text-neon underline transition-colors">
            HD unlock $2.99
          </Link>
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-xl">
          {[
            { icon: "🤖", label: "DeepSeek AI", sub: "Smart predictions" },
            { icon: "🎨", label: "HD Share Card", sub: "Cyberpunk style" },
            { icon: "⚡", label: "No Login", sub: "Instant results" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-1.5 p-4 rounded-lg bg-surface border border-zinc-800/50"
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="text-sm font-semibold text-zinc-200">{f.label}</span>
              <span className="text-xs text-zinc-500">{f.sub}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
