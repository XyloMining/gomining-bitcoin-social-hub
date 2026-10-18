import { createServerFn } from "@tanstack/react-start";

export type FeedPost = {
  id: string;
  platform: "YouTube" | "Reddit" | "TikTok";
  title: string;
  url: string;
  date: string;
  thumbnail?: string | undefined;
  views?: number | undefined;
  likes?: number | undefined;
  comments?: number | undefined;
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
      views: Number(e.match(/<media:statistics views="(\d+)"/)?.[1] ?? 0),
      likes: Number(e.match(/<media:starRating count="(\d+)"/)?.[1] ?? 0),
    };
  });
}

async function reddit(): Promise<FeedPost[]> {
  const res = await fetch("https://www.reddit.com/user/Xylo_mining/submitted.json?limit=10", {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as {
    data?: { children?: { data: { id: string; title: string; permalink: string; created_utc: number; score?: number; num_comments?: number } }[] };
  };
  return (json.data?.children ?? []).map(({ data: d }) => ({
    id: `rd-${d.id}`,
    likes: d.score,
    comments: d.num_comments,
    platform: "Reddit" as const,
    title: d.title,
    url: `https://www.reddit.com${d.permalink}`,
    date: new Date(d.created_utc * 1000).toISOString(),
  }));
}

async function tiktok(): Promise<FeedPost[]> {
  const lovable = process.env["LOVABLE_API_KEY"];
  const key = process.env["TIKTOK_API_KEY"];
  if (!lovable || !key) return [];
  const res = await fetch(
    "https://connector-gateway.lovable.dev/tiktok/video/list/?fields=id,title,create_time,cover_image_url,share_url,view_count,like_count,comment_count",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${lovable}`, "X-Connection-Api-Key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ max_count: 10 }),
    },
  );
  if (!res.ok) {
    console.error(`TikTok request failed [${res.status}]: ${await res.text()}`);
    return [];
  }
  const json = (await res.json()) as {
    data?: { videos?: { id: string; title?: string; create_time: number; cover_image_url?: string; share_url: string; view_count?: number; like_count?: number; comment_count?: number }[] };
  };
  return (json.data?.videos ?? []).map((v) => ({
    id: `tt-${v.id}`,
    platform: "TikTok" as const,
    title: v.title || "TikTok video",
    url: v.share_url,
    date: new Date(v.create_time * 1000).toISOString(),
    thumbnail: v.cover_image_url,
    views: v.view_count,
    likes: v.like_count,
    comments: v.comment_count,
  }));
}

export const getLatestPosts = createServerFn({ method: "GET" }).handler(async () => {
  const results = await Promise.allSettled([youtube(), tiktok(), reddit()]);
  const posts = results.flatMap((r) =>
    r.status === "fulfilled" ? [...r.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3) : [],
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
});
