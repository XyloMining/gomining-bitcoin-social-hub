import { useState } from "react";
import type { FeedPost } from "@/lib/feed.functions";
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

export function PostCard({ p }: { p: FeedPost }) {
  return (
    <a href={p.url} target="_blank" rel="noreferrer" className="group block border border-border bg-card transition hover:border-gold">
      {p.thumbnail && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </div>
      )}
      <div className="p-5">
        <p className="eyebrow">
          {p.platform} · {p.date ? new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""}
        </p>
        <h3 className="mt-2 text-xl leading-snug">{p.title}</h3>
      </div>
    </a>
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
