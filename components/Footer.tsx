import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-800/50 bg-bg/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Top row: nav links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500 mb-4">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <Link href="/generate" className="hover:text-zinc-300 transition-colors">
            Generate
          </Link>
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="hover:text-zinc-300 transition-colors">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </Link>
          <Link href="/refund" className="hover:text-zinc-300 transition-colors">
            Refunds
          </Link>
        </div>

        {/* Bottom row: copyright + legal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-zinc-600">
          <span>&copy; {new Date().getFullYear()} AI World Cup Oracle. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <span>Not affiliated with FIFA. For entertainment purposes only.</span>
        </div>
      </div>
    </footer>
  );
}
