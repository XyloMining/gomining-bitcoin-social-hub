import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/posts-query";
import { PostCard } from "./Cards";
import { mergePosts } from "@/lib/merge-posts";
import type { FeedPost } from "@/lib/feed.functions";

export function PlatformFeed({ platform }: { platform?: FeedPost["platform"] }) {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = platform ? data.filter((p) => p.platform === platform) : mergePosts(data);
  if (!posts.length) return <p className="text-muted-foreground">New posts are on the way.</p>;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => <PostCard key={p.id} p={p} />)}
    </div>
  );
}
