import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { articlesQuery, orderArticles, type Article } from "@/lib/articles-query";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Articles | Xylo Mining" },
      { name: "description", content: "Xylo Mining articles on GoMining and Bitcoin mining, with real results and lessons learned." },
      { property: "og:title", content: "Articles | Xylo Mining" },
      { property: "og:description", content: "Articles on GoMining and Bitcoin mining from Xylo Mining." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery),
  component: Articles,
});

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";

function Featured({ a }: { a: Article }) {
  return (
    <a href={a.url} target="_blank" rel="noreferrer" className="group grid border border-border bg-card transition hover:border-gold md:grid-cols-2">
      {a.thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-72">
          <img src={a.thumbnail} alt={a.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="eyebrow">Recommended · {fmtDate(a.date)}</p>
        <h3 className="mt-3 text-3xl leading-tight sm:text-4xl">{a.title}</h3>
        {a.subtitle && <p className="mt-4 text-muted-foreground">{a.subtitle}</p>}
        <span className="mt-8 inline-block self-start bg-primary px-7 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition group-hover:bg-gold-deep">
          Read the article
        </span>
      </div>
    </a>
  );
}

function ArticleCard({ a }: { a: Article }) {
  return (
    <a href={a.url} target="_blank" rel="noreferrer" className="group flex flex-col border border-border bg-card transition hover:border-gold">
      {a.thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img src={a.thumbnail} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">Medium · {fmtDate(a.date)}</p>
        <h3 className="mt-2 line-clamp-3 text-xl leading-snug">{a.title}</h3>
        <span className="mt-auto pt-4 text-xs uppercase tracking-[0.2em] text-gold-deep">Read on Medium →</span>
      </div>
    </a>
  );
}

function Articles() {
  const { data } = useSuspenseQuery(articlesQuery);
  const { featured, rest } = orderArticles(data);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Written by me" title="Articles" />
        <Featured a={featured} />
        {rest.length > 0 && (
          <section className="pt-16">
            <p className="eyebrow mb-6">More articles</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => <ArticleCard key={a.url} a={a} />)}
            </div>
          </section>
        )}
        <p className="pt-12 text-sm text-muted-foreground">
          All articles are on{" "}
          <a href="https://xylomining.medium.com" target="_blank" rel="noreferrer" className="text-gold-deep underline-offset-4 hover:underline">
            xylomining.medium.com
          </a>
          .
        </p>
      </main>
      <Footer />
    </div>
  );
}
