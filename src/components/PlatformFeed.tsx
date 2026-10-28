import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/posts-query";
import { PostCard } from "./Cards";
import { mergePosts } from "@/lib/merge-posts";
import { featuredPerPlatform, selectFeatured } from "@/lib/feed-select";
import type { FeedPost } from "@/lib/feed.functions";

const grid = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

/** One platform: its top post, then its 5 most recent. No platform: the same choice from every platform, merged. */
export function PlatformFeed({ platform, emptyNote }: { platform?: FeedPost["platform"]; emptyNote?: null }) {
  const { data } = useSuspenseQuery(postsQuery);
  if (!platform) {
    const posts = mergePosts(featuredPerPlatform(data));
    if (!posts.length) return <p className="text-muted-foreground">New posts are on the way.</p>;
    return <div className={grid}>{posts.map((p) => <PostCard key={p.id} p={p} />)}</div>;
  }
  const { top, recent } = selectFeatured(data.filter((p) => p.platform === platform));
  if (!top && !recent.length) return emptyNote === null ? null : <p className="text-muted-foreground">New posts are on the way.</p>;
  return (
    <div className="space-y-12">
      {top && (
        <section aria-labelledby="top-h">
          <h2 id="top-h" className="eyebrow mb-4">Top post</h2>
          <div className={grid}><PostCard p={top} /></div>
        </section>
      )}
      {recent.length > 0 && (
        <section aria-labelledby="recent-h">
          <h2 id="recent-h" className="eyebrow mb-4">Latest</h2>
          <div className={grid}>{recent.map((p) => <PostCard key={p.id} p={p} />)}</div>
        </section>
      )}
    </div>
  );
}
