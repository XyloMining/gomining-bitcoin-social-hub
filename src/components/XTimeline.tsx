import { useEffect, useRef } from "react";

declare global {
  interface Window { twttr?: { widgets?: { load: (el?: HTMLElement) => void } } }
}

export function XTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    if (ref.current) {
      ref.current.innerHTML = `<a class="twitter-timeline" data-height="700" data-chrome="noheader nofooter transparent" data-theme="${dark ? "dark" : "light"}" href="https://twitter.com/Xylo_mining">Posts by @Xylo_mining</a>`;
    }
    if (window.twttr?.widgets) {
      window.twttr.widgets.load(ref.current ?? undefined);
    } else {
      const s = document.createElement("script");
      s.src = "https://platform.twitter.com/widgets.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);
  return (
    <div className="border border-border bg-card p-4">
      <div ref={ref} />
      <a href="https://x.com/Xylo_mining" target="_blank" rel="noreferrer" className="mt-4 block text-center text-xs uppercase tracking-[0.2em] text-gold-deep">
        Open @Xylo_mining on X →
      </a>
    </div>
  );
}
