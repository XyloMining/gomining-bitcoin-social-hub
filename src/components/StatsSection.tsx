import { useEffect, useState } from "react";
import { fmtCount, isStatsFile, total, type StatsFile } from "@/lib/stats";

function Tile({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <p className="eyebrow">{k}</p>
      <p className="mt-2 font-display text-4xl">{v}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

/** Total views, likes and followers across the channels, read at runtime from /stats.json. */
export function StatsSection() {
  const [file, setFile] = useState<StatsFile | null | "error">(null);
  useEffect(() => {
    let off = false;
    fetch("/stats.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (!off) setFile(isStatsFile(d) ? d : "error"); })
      .catch(() => { if (!off) setFile("error"); });
    return () => { off = true; };
  }, []);

  if (file === "error") return null; // the feed still works without the numbers
  const ps = file ? file.platforms : [];
  const updated = file
    ? new Date(file.updated).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <section className="mb-10" aria-labelledby="feed-stats-h">
      <h2 id="feed-stats-h" className="eyebrow">Channel stats</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <Tile k="Total views" v={file ? fmtCount(total(ps, "views")) : "..."} sub="All platforms with a figure" />
        <Tile k="Total likes" v={file ? fmtCount(total(ps, "likes")) : "..."} sub="Where the platform reports it" />
        <Tile k="Total followers" v={file ? fmtCount(total(ps, "followers")) : "..."} sub="Subscribers and followers" />
      </div>
      {updated && (
        <p className="mt-3 text-xs text-muted-foreground">
          Last updated {updated}. Public numbers from the platforms. "n/a" means a platform does not publish that total.
        </p>
      )}
    </section>
  );
}
