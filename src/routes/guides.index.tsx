import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { guides, searchGuides } from "@/lib/guides";

const TITLE = "Bitcoin Mining Guides | Xylo Mining";
const DESC = "Plain-English Bitcoin mining guides: difficulty, hashrate and W/TH, solo vs pools, GoMining digital miners, maintenance fees and profitability.";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://xylomining.github.io/guides/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Bitcoin mining guides",
        url: "https://xylomining.github.io/guides/",
        hasPart: guides.filter((g) => !g.home).map((g) => ({ "@type": "Article", headline: g.title, url: `https://xylomining.github.io/guides/${g.slug}/` })),
      }),
    }],
  }),
  component: Guides,
});

function Guides() {
  const [q, setQ] = useState("");
  const results = searchGuides(q).filter((g) => !g.home);
  const total = guides.filter((g) => !g.home).length;
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Learn" title="Bitcoin mining guides" />
        <label htmlFor="guide-search" className="eyebrow block">Search the guides</label>
        <input
          id="guide-search" type="search" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Try: difficulty, W/TH, maintenance, pool"
          className="mt-2 w-full max-w-xl border border-border bg-background px-4 py-3 text-lg outline-none focus:border-gold"
        />
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          {results.length} of {total} guides{q.trim() ? ` match "${q.trim()}"` : ""}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((g) => (
            <Link key={g.slug} to="/guides/$slug" params={{ slug: g.slug }} className="group flex flex-col border border-border bg-card p-6 transition hover:border-gold">
              <p className="eyebrow">{g.readingMinutes} min read</p>
              <h2 className="mt-2 text-2xl leading-snug">{g.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{g.summary}</p>
              <span className="mt-auto pt-5 text-xs uppercase tracking-[0.2em] text-gold-deep">Read the guide →</span>
            </Link>
          ))}
        </div>
        {results.length === 0 && <p className="mt-8 text-muted-foreground">No guides match. Try a shorter search.</p>}
        <p className="pt-12 text-sm text-muted-foreground">
          Want numbers for your own setup? Try the <Link to="/calculator" className="text-gold-deep underline-offset-4 hover:underline">mining calculator</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
