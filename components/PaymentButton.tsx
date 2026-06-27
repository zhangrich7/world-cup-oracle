"use client";

import { useEffect, useState } from "react";

interface PaymentButtonProps {
  predictionId: string;
}

export default function PaymentButton({ predictionId }: PaymentButtonProps) {
  const [wentToPay, setWentToPay] = useState(false);

  // If user went to PayPal and came back, show "I've Paid" automatically
  useEffect(() => {
    const pending = localStorage.getItem("paypal_return");
    if (pending) {
      setWentToPay(true);
    }
  }, []);

  const handlePay = () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const returnUrl = `${siteUrl}/result?predictionId=${encodeURIComponent(predictionId)}&paid=true`;

    localStorage.setItem("paypal_return", returnUrl);

    // Direct redirect — no popup, no blocker
    window.location.href =
      "https://www.paypal.com/paypalme/fegan77777/2.99";
  };

  const handleUnlock = () => {
    const returnUrl = localStorage.getItem("paypal_return") || "";
    localStorage.removeItem("paypal_return");
    window.location.href = returnUrl || "/result";
  };

  return (
    <div className="space-y-3">
      {!wentToPay ? (
        <button
          onClick={handlePay}
          className="w-full py-3 bg-[#0070ba] text-white font-bold rounded-lg hover:bg-[#003087] transition-all shadow-[0_0_20px_rgba(0,112,186,0.25)] text-sm"
        >
          ⚡ Unlock HD Card — $2.99 via PayPal
        </button>
      ) : (
        <div className="space-y-3 rounded-xl border border-[#0070ba]/30 bg-[#0070ba]/5 p-4">
          <p className="text-xs text-zinc-300 text-center">
            Complete payment on PayPal, then come back here
          </p>
          <button
            onClick={handleUnlock}
            className="w-full py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(0,255,170,0.25)] text-sm"
          >
            ✨ I've Paid — Show HD Card
          </button>
          <button
            onClick={handlePay}
            className="w-full text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            Pay again
          </button>
        </div>
      )}
    </div>
  );
}
