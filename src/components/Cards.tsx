import { useState } from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";

const fmt = (n: number) => new Intl.NumberFormat("en", { notation: "compact" }).format(n);
import type { FeedPost } from "@/lib/feed.functions";
import type { MergedPost } from "@/lib/merge-posts";
import { referrals, socials } from "@/lib/site";

export function ReferralCard({ r }: { r: (typeof referrals)[number] }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group flex flex-col border border-border bg-card p-7 transition hover:border-gold">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl">{r.name}</h3>
        <span className="eyebrow">{r.tag}</span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{r.blurb}</p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(r.code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="mt-6 flex items-center justify-between border border-dashed border-border px-4 py-2 font-mono text-sm hover:border-gold"
      >
        <span>{r.code}</span>
        <span className="text-xs text-muted-foreground">{copied ? "Copied" : "Copy code"}</span>
      </button>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 bg-primary px-4 py-3 text-center text-xs uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-deep"
      >
        Join {r.name}
      </a>
    </div>
  );
}

export function PostCard({ p }: { p: FeedPost & { sources?: MergedPost["sources"] } }) {
  const sources = p.sources ?? [{ platform: p.platform, url: p.url }];
  const date = p.date ? new Date(p.date).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";
  return (
    <div className="group flex flex-col border border-border bg-card transition hover:border-gold">
      <a href={p.url} target="_blank" rel="noreferrer" className="block">
        {p.thumbnail && (
          <div className="aspect-video overflow-hidden bg-muted">
            <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="px-5 pt-5">
          <p className="eyebrow">{sources.map((s) => s.platform).join(" + ")} · {date}</p>
          <h3 className="mt-2 line-clamp-3 text-xl leading-snug">{p.title}</h3>
        </div>
      </a>
      <div className="mx-5 mb-5 mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        {p.views !== undefined && <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" />{fmt(p.views)}</span>}
        {p.likes !== undefined && <span className="flex items-center gap-1.5"><Heart className="h-3.5 w-3.5" />{fmt(p.likes)}</span>}
        {p.comments !== undefined && <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />{fmt(p.comments)}</span>}
        {sources.length > 1 && (
          <span className="ml-auto flex gap-3">
            {sources.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-gold-deep hover:underline">{s.platform}</a>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

export function SocialGrid() {
  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-5">
      {socials.map((s) => (
        <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="group bg-background p-6 transition hover:bg-card">
          <p className="font-display text-2xl group-hover:text-gold-deep">{s.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{s.handle}</p>
        </a>
      ))}
    </div>
  );
}
