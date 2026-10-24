// Builds public/stats.json from the TikTok fetch (xylomining-shorts-media/scripts/tiktok_stats.py)
// and YouTube channel numbers.
//   node scripts/build-stats.mjs --tiktok data/tiktok_metrics.json --youtube-handle @xylomining \
//        --youtube-followers 1 --youtube-views 295 --youtube-videos 11
import { readFileSync, writeFileSync } from "node:fs";

const a = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, arr) => (v.startsWith("--") ? [...acc, [v.slice(2), arr[i + 1]]] : acc), []));
const n = (v) => (v === undefined || v === "" ? null : Number(v));
const platforms = [];

platforms.push({
  platform: "YouTube", handle: a["youtube-handle"], followers: n(a["youtube-followers"]),
  views: n(a["youtube-views"]), likes: null, videos: n(a["youtube-videos"]),
});

if (a.tiktok) {
  const t = JSON.parse(readFileSync(a.tiktok, "utf8"));
  const sum = (k) => t.videos.reduce((s, v) => s + (v[k] ?? 0), 0);
  platforms.push({
    platform: "TikTok", handle: "@" + t.account.handle, followers: t.account.followers ?? null,
    views: t.videos.length ? sum("views") : null, likes: t.account.likes ?? sum("likes"), videos: t.account.videos ?? t.videos.length,
  });
} else {
  platforms.push({ platform: "TikTok", followers: null, views: null, likes: null, videos: null });
}

writeFileSync(new URL("../public/stats.json", import.meta.url), JSON.stringify({ updated: new Date().toISOString(), platforms }, null, 2) + "\n");
console.log("wrote public/stats.json", platforms);
