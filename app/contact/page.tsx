import Link from "next/link";

export const metadata = {
  title: "Contact — AI World Cup Oracle",
  description: "Get in touch with the AI World Cup Oracle team.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          Contact <span className="text-neon">Us</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-10">
          We are a small team. We read every message.
        </p>

        <div className="space-y-6 text-left bg-surface border border-zinc-800 rounded-xl p-8">
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-1">General Inquiries</h2>
            <a href="mailto:zhangrich5@gmail.com" className="text-neon hover:underline text-sm">
              zhangrich5@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-1">Customer Support</h2>
            <a href="mailto:zhangrich5@gmail.com" className="text-neon hover:underline text-sm">
              zhangrich5@gmail.com
            </a>
            <p className="text-xs text-zinc-500 mt-1">Response within 24 hours on weekdays.</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-1">Privacy & Legal</h2>
            <a href="mailto:zhangrich5@gmail.com" className="text-neon hover:underline text-sm">
              zhangrich5@gmail.com
            </a>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs text-zinc-500">
              AI World Cup Oracle is an independent project. We are not affiliated with FIFA.
              All World Cup-related trademarks belong to their respective owners.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
