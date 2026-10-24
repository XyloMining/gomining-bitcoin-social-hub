export type PlatformStats = {
  platform: string;
  handle?: string;
  followers: number | null;
  views: number | null;
  /** null where the platform does not give a public total (YouTube channel likes). */
  likes: number | null;
  videos: number | null;
};

export type StatsFile = { updated: string; platforms: PlatformStats[] };

const num = (v: unknown) => v === null || (typeof v === "number" && Number.isFinite(v) && v >= 0);

export function isStatsFile(d: unknown): d is StatsFile {
  const f = d as StatsFile;
  return (
    !!f && typeof f.updated === "string" && Array.isArray(f.platforms) &&
    f.platforms.every((p) => typeof p?.platform === "string" && num(p.followers) && num(p.views) && num(p.likes) && num(p.videos))
  );
}

/** Sum of a field across platforms, ignoring platforms that have no figure. Null when none has one. */
export function total(platforms: PlatformStats[], key: "followers" | "views" | "likes"): number | null {
  const vals = platforms.map((p) => p[key]).filter((v): v is number => v !== null);
  return vals.length ? vals.reduce((a, b) => a + b, 0) : null;
}

export const fmtCount = (n: number | null) => (n === null ? "n/a" : n.toLocaleString("en-AU"));
