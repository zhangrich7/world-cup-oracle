export const metadata = {
  title: "Privacy Policy — AI World Cup Oracle",
  description: "How AI World Cup Oracle collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen px-4 py-16 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
          Privacy <span className="text-neon">Policy</span>
        </h1>
        <p className="text-zinc-500 text-sm mb-10">Last updated: June 25, 2026</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">1. Information We Collect</h2>
            <p>
              AI World Cup Oracle is designed with privacy in mind. We collect minimal data:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Prediction data:</strong> Match selections, supported teams, style preferences, and generated predictions are stored temporarily in server memory to generate your share card. This data is automatically purged and is not persisted to a database.</li>
              <li><strong>Payment information:</strong> When you purchase the HD Unlock, payment is processed by Lemon Squeezy (our payment processor). We do not receive or store your full credit card number, CVV, or billing address. Lemon Squeezy provides us with a transaction confirmation only.</li>
              <li><strong>Usage data:</strong> We do not use cookies, analytics trackers, or any third-party tracking scripts. We do not collect IP addresses, browser fingerprints, or device information for tracking purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To generate your AI match prediction and share card</li>
              <li>To process your HD Unlock payment via Lemon Squeezy</li>
              <li>To respond to customer support inquiries</li>
            </ul>
            <p className="mt-2">We do not sell, rent, or share your data with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">3. Data Storage and Retention</h2>
            <p>
              Prediction data is stored in volatile server memory (RAM) only and is automatically removed when the
              server restarts or the memory is reclaimed. We do not maintain a persistent database of user predictions.
              Payment transaction records are retained by Lemon Squeezy per their data retention policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">4. Cookies</h2>
            <p>
              We do not use cookies, localStorage, or any browser storage for tracking purposes. The website may use
              minimal, essential session storage required by the application framework (Next.js) to function, which is
              not used for tracking.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">5. Third-Party Services</h2>
            <p>We rely on the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>DeepSeek API:</strong> Processes match data to generate AI predictions. Review DeepSeek&apos;s privacy policy for details on how they handle API requests.</li>
              <li><strong>Lemon Squeezy:</strong> Processes payments for the HD Unlock feature. Review Lemon Squeezy&apos;s privacy policy for details on payment data handling.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">6. Data Security</h2>
            <p>
              We use HTTPS encryption for all data in transit. Since we do not store user data in a persistent database,
              the risk of data breach is minimal. Payment processing is handled entirely by Lemon Squeezy&apos;s secure
              infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">7. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed at children under 13. We do not knowingly collect personal information from
              children under 13. If you believe a child has provided us with personal data, please contact us and we
              will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction (including GDPR in the EU/UK and CCPA in California), you may have rights
              to access, correct, or delete your personal data. Since we store prediction data only in temporary memory,
              most user data self-deletes. For any persistent data concerns, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be posted on this page with an
              updated effective date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-100 mt-8 mb-3">10. Contact</h2>
            <p>
              Privacy-related inquiries:{" "}
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
