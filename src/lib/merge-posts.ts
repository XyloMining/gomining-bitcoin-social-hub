import type { FeedPost } from "./feed.functions";

export type MergedPost = FeedPost & { sources: { platform: FeedPost["platform"]; url: string }[] };

const norm = (t: string) =>
  t
    .toLowerCase()
    .replace(/#\w+/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function same(a: FeedPost, b: FeedPost) {
  if (a.thumbnail && a.thumbnail === b.thumbnail) return true;
  if (a.url === b.url) return true;
  const x = norm(a.title);
  const y = norm(b.title);
  if (!x || !y) return false;
  if (x === y) return true;
  const [short, long] = x.length < y.length ? [x, y] : [y, x];
  return short.length >= 20 && long.startsWith(short);
}

const add = (a?: number, b?: number) => (a === undefined && b === undefined ? undefined : (a ?? 0) + (b ?? 0));

/** Combine posts that share a thumbnail, title or link into one item with summed stats. */
export function mergePosts(posts: FeedPost[]): MergedPost[] {
  const out: MergedPost[] = [];
  for (const p of posts) {
    const hit = out.find((m) => same(m, p));
    if (hit) {
      hit.views = add(hit.views, p.views);
      hit.likes = add(hit.likes, p.likes);
      hit.comments = add(hit.comments, p.comments);
      hit.sources.push({ platform: p.platform, url: p.url });
      if (!hit.thumbnail && p.thumbnail) hit.thumbnail = p.thumbnail;
      if (p.date > hit.date) hit.date = p.date;
    } else {
      out.push({ ...p, sources: [{ platform: p.platform, url: p.url }] });
    }
  }
  return out.sort((a, b) => b.date.localeCompare(a.date));
}
