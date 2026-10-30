import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header, Footer } from "@/components/SiteChrome";
import { getGuide, guides } from "@/lib/guides";
import { referrals } from "@/lib/site";

const ORIGIN = "https://xylomining.github.io";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const g = getGuide(params.slug);
    if (!g) throw notFound();
    return g;
  },
  head: ({ loaderData: g }) => {
    if (!g) return {};
    const url = `${ORIGIN}/guides/${g.slug}/`;
    return {
      meta: [
        { title: `${g.title} | Xylo Mining` },
        { name: "description", content: g.description },
        { name: "keywords", content: g.keywords.join(", ") },
        { property: "og:title", content: g.title },
        { property: "og:description", content: g.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.description,
          dateModified: g.updated, datePublished: g.updated, mainEntityOfPage: url,
          author: { "@type": "Person", name: "Xylo" }, publisher: { "@type": "Organization", name: "Xylo Mining" },
        }) },
        { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }) },
        { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
            { "@type": "ListItem", position: 2, name: "Guides", item: `${ORIGIN}/guides/` },
            { "@type": "ListItem", position: 3, name: g.title, item: url },
          ],
        }) },
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: () => (
    <div className="min-h-screen"><Header /><main className="mx-auto max-w-3xl px-5 pt-16"><p>Guide not found.</p><Link to="/guides" className="text-gold-deep">All guides</Link></main></div>
  ),
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function GuidePage() {
  const g = Route.useLoaderData();
  const related = g.related.map((s) => guides.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/guides" className="hover:text-foreground">Guides</Link> / <span>{g.title}</span>
        </nav>
        <article className="pt-6">
          <p className="eyebrow">{g.readingMinutes} min read · Updated {new Date(g.updated).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{g.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{g.description}</p>

          <aside className="mt-8 border border-border bg-card p-6">
            <p className="eyebrow">Key takeaways</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">{g.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
          </aside>

          {g.sections.map((s) => (
            <section key={s.heading} className="pt-10" aria-labelledby={slugify(s.heading)}>
              <h2 id={slugify(s.heading)} className="text-3xl">{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p} className="mt-4 leading-relaxed">{p}</p>)}
              {s.list && <ul className="mt-4 list-disc space-y-2 pl-5">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>}
            </section>
          ))}

          {g.referral && (
            <aside className="mt-10 border border-gold bg-card p-6" aria-labelledby="referral-cta">
              <p className="eyebrow">Referral</p>
              <h2 id="referral-cta" className="mt-2 text-2xl">{g.referral.heading}</h2>
              <p className="mt-2 text-muted-foreground">{g.referral.intro}</p>
              <ul className="mt-4 space-y-3">
                {g.referral.benefits.map((b) => (
                  <li key={b.title}><span className="font-medium">{b.title}</span><br /><span className="text-sm text-muted-foreground">{b.detail}</span></li>
                ))}
              </ul>
              <a href={referrals[0].url} target="_blank" rel="noopener noreferrer sponsored" className="mt-5 inline-block border border-gold bg-gold px-5 py-3 font-medium text-black">
                Join GoMining with my link
              </a>
              <p className="mt-3 text-sm text-muted-foreground">Referral code: <span className="font-mono">{referrals[0].code}</span></p>
              <p className="mt-3 text-xs text-muted-foreground">{g.referral.note}</p>
            </aside>
          )}

          <section className="pt-12">
            <h2 className="text-3xl">Frequently asked questions</h2>
            <dl className="mt-4 space-y-5">
              {g.faq.map((f) => (
                <div key={f.q}><dt className="font-medium">{f.q}</dt><dd className="mt-1 text-muted-foreground">{f.a}</dd></div>
              ))}
            </dl>
          </section>

          <p className="mt-12 border border-gold bg-card p-5 text-sm">
            Try it with your own numbers in the <Link to="/calculator" className="text-gold-deep underline-offset-4 hover:underline">mining calculator</Link>. Estimates change with Bitcoin prices, mining difficulty, fees and platform costs. This is education, not financial advice or a promise of returns.
          </p>

          <section className="pt-10">
            <p className="eyebrow">Sources</p>
            <ul className="mt-3 space-y-1 text-sm">
              {g.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-gold-deep underline-offset-4 hover:underline">{s.label}</a></li>)}
            </ul>
          </section>

          {related.length > 0 && (
            <section className="pt-10">
              <p className="eyebrow">Keep reading</p>
              <ul className="mt-3 space-y-2">
                {related.map((r) => <li key={r.slug}><Link to="/guides/$slug" params={{ slug: r.slug }} className="text-gold-deep underline-offset-4 hover:underline">{r.title}</Link></li>)}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
