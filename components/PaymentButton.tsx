"use client";

interface PaymentButtonProps {
  predictionId: string;
}

export default function PaymentButton({ predictionId }: PaymentButtonProps) {
  const lemonLink = process.env.NEXT_PUBLIC_LEMON_LINK;

  const handleUnlock = () => {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const returnUrl = `${siteUrl}/result?predictionId=${encodeURIComponent(predictionId)}&paid=true`;

    if (lemonLink) {
      const separator = lemonLink.includes("?") ? "&" : "?";
      window.location.href = `${lemonLink}${separator}checkout[success_url]=${encodeURIComponent(returnUrl)}`;
    } else {
      // Dev mode — skip payment, redirect directly
      window.location.href = returnUrl;
    }
  };

  return (
    <button
      onClick={handleUnlock}
      className="flex-1 py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon/90 transition-all shadow-[0_0_20px_rgba(0,255,170,0.25)]"
    >
      {lemonLink ? "Unlock HD Card — $2.99" : "Unlock HD Card (Dev Mode)"}
    </button>
  );
}
