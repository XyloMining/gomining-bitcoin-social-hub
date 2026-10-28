import type { FeedPost } from "./feed.functions";

/** Most views first, then most likes. A post with no views and no likes is never "top". */
const score = (p: FeedPost) => (p.views ?? 0) * 1e6 + (p.likes ?? 0);

/**
 * What a platform shows: its single top post (most views, then likes) plus its 5 most recent others.
 * The data files keep every post ever fetched, so this is only a display choice, never a deletion.
 */
export function selectFeatured<T extends FeedPost>(posts: T[], recentCount = 5): { top: T | undefined; recent: T[] } {
  const byDate = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const best = [...posts].sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date))[0];
  const top = best && score(best) > 0 ? best : undefined;
  return { top, recent: byDate.filter((p) => p !== top).slice(0, recentCount) };
}

/** The same choice for every platform in the list, as one flat list (used by the All tab). */
export function featuredPerPlatform<T extends FeedPost>(posts: T[]): T[] {
  const platforms = [...new Set(posts.map((p) => p.platform))];
  return platforms.flatMap((pl) => {
    const { top, recent } = selectFeatured(posts.filter((p) => p.platform === pl));
    return top ? [top, ...recent] : recent;
  });
}
