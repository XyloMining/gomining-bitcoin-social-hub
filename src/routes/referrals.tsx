import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { ReferralCard } from "@/components/Cards";
import { referrals } from "@/lib/site";

export const Route = createFileRoute("/referrals")({
  head: () => ({
    meta: [
      { title: "Referral Codes — Xylo Mining" },
      { name: "description", content: "GoMining, Kryptex, Coinbase and Coinbase Wallet referral codes from Xylo Mining." },
      { property: "og:title", content: "Referral Codes — Xylo Mining" },
      { property: "og:description", content: "Use Xylo Mining's codes for GoMining, Kryptex and Coinbase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Referrals,
});

function Referrals() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="The tools I use" title="Referral codes" />
        <div className="grid gap-6 sm:grid-cols-2">
          {referrals.map((r) => <ReferralCard key={r.name} r={r} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
