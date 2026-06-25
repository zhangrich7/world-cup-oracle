export const metadata = {
  title: "Refund Policy — AI World Cup Oracle",
  description: "Our refund policy for the HD Unlock one-time purchase.",
};

export default function RefundPage() {
  return (
    <main className="relative min-h-screen px-4 py-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
          Refund <span className="text-neon">Policy</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: June 25, 2026</p>

        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">1. Digital Product Policy</h2>
            <p>
              The HD Unlock is a digital product ($2.99 USD one-time payment) that provides instant access to
              watermark-free prediction cards and PNG download capability. Due to the nature of digital goods, all
              sales are generally final. However, we stand behind our product and offer refunds in the circumstances
              described below.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">2. When You Are Eligible for a Refund</h2>
            <p>You may request a refund within 7 days of purchase if any of the following applies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The HD Unlock feature did not work due to a technical error on our side (e.g., payment succeeded but the card remained watermarked).</li>
              <li>You were charged multiple times for the same purchase due to a billing error.</li>
              <li>The generated PNG download file was corrupted or unreadable and we were unable to resolve the issue.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">3. When Refunds Are Not Available</h2>
            <p>Refunds are not provided in the following cases:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>You simply changed your mind after unlocking the HD card.</li>
              <li>You disagree with the AI prediction result (predictions are for entertainment and not guaranteed to be accurate).</li>
              <li>You purchased by accident but already downloaded or used the HD card.</li>
              <li>More than 7 days have passed since the purchase date.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">4. How to Request a Refund</h2>
            <p>
              Send an email to{" "}
              <a href="mailto:zhangrich5@gmail.com" className="text-neon hover:underline">
                zhangrich5@gmail.com
              </a>{" "}
              with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Subject line: &ldquo;Refund Request&rdquo;</li>
              <li>Your Lemon Squeezy order number or the email address used at checkout</li>
              <li>A brief description of the issue</li>
            </ul>
            <p className="mt-2">We review all requests within 2 business days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">5. Processing Time</h2>
            <p>
              Approved refunds are processed within 5–10 business days and returned to the original payment method.
              Processing time varies by your bank or card issuer. Once processed, you will receive a confirmation email.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">6. Chargebacks</h2>
            <p>
              If you believe a charge was unauthorized or in error, please contact us first before initiating a
              chargeback with your bank. Most issues can be resolved quickly. Chargebacks filed without prior contact
              may result in permanent account restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">7. Contact</h2>
            <p>
              Refund-related inquiries:{" "}
              <a href="mailto:zhangrich5@gmail.com" className="text-neon hover:underline">
                zhangrich5@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
