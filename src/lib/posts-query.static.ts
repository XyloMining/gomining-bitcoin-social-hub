import { queryOptions } from "@tanstack/react-query";
import type { FeedPost } from "./feed.functions";

/**
 * Static-hosting version of posts-query.ts, used only by vite.pages.config.ts.
 * GitHub Pages has no server, so posts come from one JSON file per platform
 * (postsyt, postsrd, postsig, poststt, postsx) next to the site, instead of a server function.
 */
/** One data file per platform, kept as full history. Missing or broken files are skipped. */
const FILES = ["postsyt.json", "postsrd.json", "postsig.json", "poststt.json", "postsx.json"];

async function loadFile(f: string): Promise<FeedPost[]> {
  try {
    const res = await fetch(`/${f}`, { cache: "no-cache" });
    if (!res.ok) return [];
    const data = (await res.json()) as FeedPost[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async (): Promise<FeedPost[]> => {
    const all = (await Promise.all(FILES.map(loadFile))).flat();
    return all.sort((a, b) => b.date.localeCompare(a.date));
  },
  // Start from an empty list, which is exactly what the pre-built page contains, so the first
  // browser render matches it (no hydration mismatch). initialDataUpdatedAt: 0 marks it stale,
  // so the real posts load straight after hydration.
  initialData: [] as FeedPost[],
  initialDataUpdatedAt: 0,
  staleTime: 5 * 60_000,
});
