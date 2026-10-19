import { queryOptions } from "@tanstack/react-query";
import type { FeedPost } from "./feed.functions";

/**
 * Static-hosting version of posts-query.ts, used only by vite.pages.config.ts.
 * GitHub Pages has no server, so posts come from a posts.json file next to the site
 * (refreshed on a schedule) instead of a server function.
 */
export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async (): Promise<FeedPost[]> => {
    try {
      const res = await fetch("/posts.json", { cache: "no-cache" });
      if (!res.ok) return [];
      const data = (await res.json()) as FeedPost[];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },
  staleTime: 5 * 60_000,
});
