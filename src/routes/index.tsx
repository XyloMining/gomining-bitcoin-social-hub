import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero-coin.jpg";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { PostCard, ReferralCard, SocialGrid } from "@/components/Cards";
import { postsQuery } from "@/lib/posts-query";
import { mergePosts } from "@/lib/merge-posts";
import { referrals } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Xylo Mining | GoMining & Bitcoin" },
      { name: "description", content: "Xylo Mining: GoMining and Bitcoin mining content, latest videos, socials and referral codes." },
      { property: "og:title", content: "Xylo Mining | GoMining & Bitcoin" },
      { property: "og:description", content: "Latest GoMining and Bitcoin content, socials and referral codes from Xylo Mining." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = mergePosts(data);
  const gm = referrals[0]!;
  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden border-b border-border">
        <img src={hero} alt="Gold Bitcoin on black marble" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover object-right opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-28 sm:py-40">
          <p className="eyebrow mb-5">GoMining · Bitcoin · Hashrate</p>
          <h1 className="max-w-2xl text-6xl leading-[0.95] sm:text-8xl">
            Mining Bitcoin, <span className="text-gold-gradient italic">the quiet way.</span>
          </h1>
          <p className="mt-6 max-w-md text-muted-foreground">
            Honest GoMining results, Bitcoin strategy and every link I use, in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={gm.url} target="_blank" rel="noreferrer" className="bg-primary px-7 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold-deep">
              Start on GoMining
            </a>
            <Link to="/feed" className="border border-foreground px-7 py-4 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background">
              Latest posts
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5">
        <section className="pt-24">
          <SectionTitle eyebrow="Find me" title="Everywhere I post" />
          <SocialGrid />
        </section>

        <section className="pt-24">
          <div className="flex items-end justify-between">
            <SectionTitle eyebrow="Auto-updated" title="Latest posts" />
            <Link to="/feed" className="mb-10 text-xs uppercase tracking-[0.2em] text-gold-deep">All →</Link>
          </div>
          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-3">
              {posts.slice(0, 3).map((p) => <PostCard key={p.id} p={p} />)}
            </div>
          ) : (
            <p className="text-muted-foreground">New posts are on the way.</p>
          )}
        </section>

        <section className="pt-24">
          <SectionTitle eyebrow="Support the channel" title="Referral codes" />
          <div className="grid gap-6 sm:grid-cols-2">
            {referrals.map((r) => <ReferralCard key={r.name} r={r} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
