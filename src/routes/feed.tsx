import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { SocialGrid } from "@/components/Cards";
import { postsQuery } from "@/lib/posts-query";

export const Route = createFileRoute("/feed")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: FeedLayout,
});

const tabs = [
  { to: "/feed", label: "All" },
  { to: "/feed/youtube", label: "YouTube" },
  { to: "/feed/tiktok", label: "TikTok" },
  { to: "/feed/x", label: "X" },
] as const;

function FeedLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-16">
        <SectionTitle eyebrow="Updated automatically" title="The feed" />
        <nav className="mb-10 flex gap-6 overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: true }}
              className="-mb-px border-b-2 border-transparent pb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              activeProps={{ className: "!border-gold !text-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <Outlet />
        <section className="pt-20">
          <SectionTitle eyebrow="More" title="Follow on every platform" />
          <SocialGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
