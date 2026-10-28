import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header, Footer, SectionTitle } from "@/components/SiteChrome";
import { fmtCount, isStatsFile, total, type StatsFile } from "@/lib/stats";

const TITLE = "Channel Stats: Views, Likes and Followers | Xylo Mining";
const DESC = "Total views, likes and followers across every Xylo Mining channel (YouTube, TikTok, Instagram, Reddit and X), updated from the platforms' own public numbers.";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://xylomining.github.io/stats/" }],
  }),
  component: Stats,
});

function Tile({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <p className="eyebrow">{k}</p>
      <p className="mt-2 font-display text-4xl">{v}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Stats() {
  const [file, setFile] = useState<StatsFile | null | "error">(null);
  useEffect(() => {
    let off = false;
    fetch("/stats.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { if (!off) setFile(isStatsFile(d) ? d : "error"); })
      .catch(() => { if (!off) setFile("error"); });
    return () => { off = true; };
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-16 pt-16">
        <SectionTitle eyebrow="Channel stats" title="Views, likes and followers" />
        {file === null && <p className="text-muted-foreground" aria-live="polite">Loading stats...</p>}
        {file === "error" && <p className="text-muted-foreground">Stats could not be loaded right now. Please try again later.</p>}
        {file && file !== "error" && <Data file={file} />}
      </main>
      <Footer />
    </div>
  );
}

function Data({ file }: { file: StatsFile }) {
  const ps = file.platforms;
  const updated = new Date(file.updated).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile k="Total views" v={fmtCount(total(ps, "views"))} sub="All platforms with a figure" />
        <Tile k="Total likes" v={fmtCount(total(ps, "likes"))} sub="Where the platform reports it" />
        <Tile k="Total followers" v={fmtCount(total(ps, "followers"))} sub="Subscribers and followers" />
      </div>

      <section className="mt-14" aria-labelledby="by-h">
        <h2 id="by-h" className="text-3xl">By platform</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] border border-border text-sm">
            <thead className="bg-card text-left">
              <tr>
                <th className="p-3">Platform</th>
                <th className="p-3 text-right">Followers</th>
                <th className="p-3 text-right">Views</th>
                <th className="p-3 text-right">Likes</th>
                <th className="p-3 text-right">Videos</th>
              </tr>
            </thead>
            <tbody>
              {ps.map((p) => (
                <tr key={p.platform} className="border-t border-border">
                  <th scope="row" className="p-3 text-left font-normal">
                    {p.platform}
                    {p.handle && <span className="block text-xs text-muted-foreground">{p.handle}</span>}
                  </th>
                  <td className="p-3 text-right">{fmtCount(p.followers)}</td>
                  <td className="p-3 text-right">{fmtCount(p.views)}</td>
                  <td className="p-3 text-right">{fmtCount(p.likes)}</td>
                  <td className="p-3 text-right">{fmtCount(p.videos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-xs text-muted-foreground">
          Last updated {updated}. These are the numbers the platforms show publicly. "n/a" means that platform does not publish that total. YouTube does not give a channel-wide likes total, and Reddit's figure is total karma.
        </p>
      </section>
    </>
  );
}
