"use client";

import { useState } from "react";

interface PaymentButtonProps {
  predictionId: string;
}

export default function PaymentButton({ predictionId }: PaymentButtonProps) {
  const [wentToPay, setWentToPay] = useState(false);

  const handlePay = () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const returnUrl = `${siteUrl}/result?predictionId=${encodeURIComponent(predictionId)}&paid=true`;

    // Remember return URL in case user closes tab and comes back
    localStorage.setItem("paypal_return", returnUrl);
    setWentToPay(true);

    window.open("https://www.paypal.com/paypalme/fegan77777/2.99", "_blank");
  };

  const handleUnlock = () => {
    const returnUrl = localStorage.getItem("paypal_return") || "";
    // Clean up
    localStorage.removeItem("paypal_return");
    window.location.href = returnUrl || "/result";
  };

  return (
    <div className="space-y-3">
      {!wentToPay ? (
        /* ---- Step 1: Go to PayPal ---- */
        <button
          onClick={handlePay}
          className="w-full py-3 bg-[#0070ba] text-white font-bold rounded-lg hover:bg-[#003087] transition-all shadow-[0_0_20px_rgba(0,112,186,0.25)] text-sm"
        >
          ⚡ Unlock HD Card — $2.99 via PayPal
        </button>
      ) : (
        /* ---- Step 2: After PayPal ---- */
        <div className="space-y-3 rounded-xl border border-[#0070ba]/30 bg-[#0070ba]/5 p-4">
          <p className="text-xs text-zinc-300 text-center">
            Complete payment in the PayPal tab, then come back here
          </p>
          <button
            onClick={handleUnlock}
            className="w-full py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(0,255,170,0.25)] text-sm"
          >
            ✨ I've Paid — Show HD Card
          </button>
          <button
            onClick={() => setWentToPay(false)}
            className="w-full text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            Pay again
          </button>
        </div>
      )}
    </div>
  );
}
