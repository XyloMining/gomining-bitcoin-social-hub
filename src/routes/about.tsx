import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { referrals, socials } from "@/lib/site";

const TITLE = "About Xylo Mining | Bitcoin mining in the open";
const DESC =
  "Xylo documents his own Bitcoin mining (GoMining and Kryptex) from Australia. See what this site is for: guides, a calculator, real results and live stats.";
const URL = "https://xylomining.github.io/about/";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org", "@type": "AboutPage", name: TITLE, url: URL, description: DESC,
        mainEntity: { "@type": "Person", name: "Xylo", brand: { "@type": "Brand", name: "Xylo Mining" }, sameAs: socials.map((s) => s.url) },
      }) },
    ],
  }),
  component: About,
});

const pages = [
  { to: "/guides/", name: "Guides", text: "Plain-English explainers on hashrate, difficulty, maintenance fees and how to work out profitability, plus a GoMining quickstart." },
  { to: "/calculator/", name: "Calculator", text: "Put in your own numbers and stress test them before you spend anything." },
  { to: "/results/", name: "My results", text: "What my own mining has actually done, shown as my numbers and not typical ones." },
  { to: "/stats/", name: "Stats", text: "Views, likes and followers across my channels, updated automatically." },
  { to: "/socials/", name: "Socials", text: "My latest videos and posts from YouTube, TikTok, Instagram, X and Reddit in one place." },
  { to: "/articles/", name: "Articles", text: "Longer write-ups on Medium." },
  { to: "/referrals/", name: "Referrals", text: "The tools I use, with my referral codes." },
] as const;

function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 pt-16">
        <SectionTitle eyebrow="About" title="Bitcoin mining, in the open" />

        <section className="space-y-4 leading-relaxed">
          <p>
            I'm Xylo, and I'm based in Australia. I mine Bitcoin in two ways: through GoMining, where I own digital hashrate that earns daily Bitcoin rewards, and with my own GPU through Kryptex.
          </p>
          <p>
            I document it as I go: the setup, the costs, what the numbers really look like, and what I get wrong. I make short videos for YouTube, TikTok and Instagram, post on X and Reddit, and write longer pieces on Medium.
          </p>
        </section>

        <section className="pt-10">
          <h2 className="text-3xl">What this site is for</h2>
          <p className="mt-4 leading-relaxed">
            Mining content online is full of hype. This site is the opposite: one place where you can learn how mining works, test the maths yourself, and see my real numbers, including the unexciting ones. It is education and a record of my own experience, not advice to buy anything.
          </p>
          <ul className="mt-6 space-y-4">
            {pages.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className="text-gold-deep underline-offset-4 hover:underline">{p.name}</Link>
                <span className="text-muted-foreground"> – {p.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-10">
          <h2 className="text-3xl">How I keep it honest</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>No promises of profit. Returns depend on Bitcoin's price, difficulty and fees, and can be negative.</li>
            <li>When I share my own results, they are my numbers, not typical, and yours can be lower.</li>
            <li>Claims in my guides link to their sources.</li>
            <li>Some videos use AI-generated narration and are labelled as such.</li>
          </ul>
        </section>

        <section className="pt-10">
          <h2 className="text-3xl">Referral links</h2>
          <p className="mt-4 leading-relaxed">
            Some links on this site and in my videos are referral links for {referrals.map((r) => r.name).join(", ")}. If you join through one I may earn a reward from that company, at no extra cost to you. I only list tools I use, and every guide that points to one says so. See the <Link to="/referrals/" className="text-gold-deep underline-offset-4 hover:underline">referrals page</Link>.
          </p>
        </section>

        <section className="pt-10">
          <h2 className="text-3xl">Find me</h2>
          <ul className="mt-4 space-y-1">
            {socials.map((s) => (
              <li key={s.name}><a href={s.url} target="_blank" rel="noreferrer" className="text-gold-deep underline-offset-4 hover:underline">{s.name}</a> <span className="text-muted-foreground">{s.handle}</span></li>
            ))}
          </ul>
        </section>

        <p className="mt-12 border border-gold bg-card p-5 text-sm">
          Not financial advice. Mining and crypto carry real risk, so only use money you can afford to lose.
        </p>
      </main>
      <Footer />
    </div>
  );
}
