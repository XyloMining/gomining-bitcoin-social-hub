import { createServerFn } from "@tanstack/react-start";

export type FeedPost = {
  id: string;
  platform: "YouTube" | "Reddit";
  title: string;
  url: string;
  date: string;
  thumbnail?: string;
};

const YT_CHANNEL = "UCXUPLb9x-nzQb-0H3A5WVow";
const UA = "Mozilla/5.0 (XyloMiningSite)";

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function youtube(): Promise<FeedPost[]> {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => {
    const e = m[1] ?? "";
    const id = e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
    return {
      id: `yt-${id}`,
      platform: "YouTube" as const,
      title: decode(e.match(/<title>(.*?)<\/title>/)?.[1] ?? "Video"),
      url: `https://www.youtube.com/watch?v=${id}`,
      date: e.match(/<published>(.*?)<\/published>/)?.[1] ?? "",
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  });
}

async function reddit(): Promise<FeedPost[]> {
  const res = await fetch("https://www.reddit.com/user/Xylo_mining/submitted.json?limit=10", {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: { children?: { data: { id: string; title: string; permalink: string; created_utc: number } }[] };
  };
  return (json.data?.children ?? []).map(({ data: d }) => ({
    id: `rd-${d.id}`,
    platform: "Reddit" as const,
    title: d.title,
    url: `https://www.reddit.com${d.permalink}`,
    date: new Date(d.created_utc * 1000).toISOString(),
  }));
}

export const getLatestPosts = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.allSettled([youtube(), reddit()]);
  const posts = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
});
