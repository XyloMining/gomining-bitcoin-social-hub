import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { PostCard, SocialGrid } from "@/components/Cards";
import { XTimeline } from "@/components/XTimeline";
import { postsQuery } from "@/lib/posts-query";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Latest Posts — Xylo Mining" },
      { name: "description", content: "Every new Xylo Mining video and post about GoMining and Bitcoin, updated automatically." },
      { property: "og:title", content: "Latest Posts — Xylo Mining" },
      { property: "og:description", content: "New GoMining and Bitcoin videos and posts from Xylo Mining." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Feed,
});

function Feed() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Updated automatically" title="The feed" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => <PostCard key={p.id} p={p} />)}
        </div>
        {!posts.length && <p className="text-muted-foreground">New posts are on the way.</p>}
        <section className="pt-20">
          <SectionTitle eyebrow="Live from X" title="Latest on X" />
          <XTimeline />
        </section>
        <section className="pt-20">
          <SectionTitle eyebrow="More" title="Follow on every platform" />
          <SocialGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
