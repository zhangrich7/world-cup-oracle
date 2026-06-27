import Link from "next/link";

export const metadata = {
  title: "Pricing — AI World Cup Oracle",
  description: "Free AI predictions. Unlock HD cards for $2.99 one-time.",
};

export default function PricingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Simple <span className="text-neon">Pricing</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            One product. One price. No subscriptions. No surprises.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free plan */}
          <div className="rounded-xl border border-zinc-800 bg-surface p-8 flex flex-col">
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Free</h2>
            <p className="text-3xl font-black text-zinc-300 mb-1">$0</p>
            <p className="text-xs text-zinc-500 mb-6">No credit card required</p>

            <ul className="space-y-3 text-sm text-zinc-400 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                AI match prediction via DeepSeek
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                1200×630 share card with watermark
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Copy social caption for X / Instagram
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                3 prediction styles (Bold / Analytical / Emotional)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                8 languages supported
              </li>
            </ul>

            <Link
              href="/generate"
              className="block text-center py-3 rounded-lg border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-zinc-500 transition-all"
            >
              Start Free →
            </Link>
          </div>

          {/* HD plan */}
          <div className="rounded-xl border border-neon/40 bg-surface p-8 flex flex-col relative shadow-[0_0_30px_rgba(0,255,170,0.08)]">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-neon text-black text-xs font-bold">
              BEST VALUE
            </span>

            <h2 className="text-xl font-bold text-neon mb-2">HD Unlock</h2>
            <p className="text-3xl font-black text-zinc-100 mb-1">$2.99</p>
            <p className="text-xs text-zinc-500 mb-6">One-time payment · Lifetime access</p>

            <ul className="space-y-3 text-sm text-zinc-400 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Everything in Free
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Watermark-free 1200×630 HD card
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Download PNG to your device
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Open full-resolution image in new tab
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon mt-0.5">✓</span>
                Perfect for printing and reposting
              </li>
            </ul>

            <Link
              href="/generate"
              className="block text-center py-3 rounded-lg bg-neon text-black font-bold text-sm hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(0,255,170,0.25)]"
            >
              Generate & Unlock →
            </Link>
          </div>
        </div>

        {/* FAQ snippet */}
        <div className="mt-12 text-center text-sm text-zinc-500 space-y-2">
          <p>
            <strong className="text-zinc-300">What payment methods do you accept?</strong>
            <br />
            Credit / debit cards via PayPal. One-time, no subscription.
          </p>
          <p>
            <strong className="text-zinc-300">Can I get a refund?</strong>
            <br />
            Yes. See our{" "}
            <Link href="/refund" className="text-neon hover:underline">
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
