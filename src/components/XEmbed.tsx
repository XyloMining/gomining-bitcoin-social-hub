import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { twttr?: { widgets?: { load: (el?: HTMLElement) => void } } }
}

const HANDLE = "Xylo_Mining";
const SCRIPT = "https://platform.x.com/widgets.js"; // X's current widget host (platform.twitter.com is the old one)
const GIVE_UP_MS = 10_000;

let loading: Promise<NonNullable<Window["twttr"]>["widgets"]> | null = null;

/** Load widgets.js once and resolve when its widgets API is ready. Rejects if it is blocked or never arrives. */
function loadWidgets() {
  if (window.twttr?.widgets?.load) return Promise.resolve(window.twttr.widgets);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.charset = "utf-8";
    const started = Date.now();
    const wait = () => {
      if (window.twttr?.widgets?.load) resolve(window.twttr.widgets);
      else if (Date.now() - started > GIVE_UP_MS) { loading = null; reject(new Error("widgets not ready")); }
      else setTimeout(wait, 100);
    };
    s.onload = wait;
    s.onerror = () => { loading = null; s.remove(); reject(new Error("widgets.js blocked")); };
    document.body.appendChild(s);
  });
  return loading;
}

/**
 * X's official profile timeline (the markup X gives at publish.x.com, used as given).
 * If the timeline does not appear within a few seconds (blocked script, ad blocker, X not serving it),
 * a short note and a link to the profile are shown instead.
 */
export function XEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ok" | "failed">("loading");

  useEffect(() => {
    let off = false;
    const el = ref.current;
    if (!el) return;
    // X's own embed code, unchanged: <a class="twitter-timeline" href="https://x.com/Xylo_Mining?ref_src=twsrc%5Etfw">Posts by Xylo_Mining</a>
    el.innerHTML = `<a class="twitter-timeline" href="https://x.com/${HANDLE}?ref_src=twsrc%5Etfw">Posts by ${HANDLE}</a>`;
    const timer = setInterval(() => {
      if (el.querySelector("iframe")) { setState("ok"); clearInterval(timer); clearTimeout(giveUp); }
    }, 300);
    const giveUp = setTimeout(() => { clearInterval(timer); if (!off) setState((s) => (s === "ok" ? s : "failed")); }, GIVE_UP_MS);
    loadWidgets().then((w) => { if (!off) w?.load(el); }).catch(() => { if (!off) setState("failed"); });
    return () => { off = true; clearInterval(timer); clearTimeout(giveUp); el.innerHTML = ""; };
  }, []);

  return (
    <div className="border border-border bg-card p-4">
      <div ref={ref} className={state === "failed" ? "hidden" : ""} />
      {state === "loading" && <p className="py-4 text-center text-sm text-muted-foreground">Loading posts from X...</p>}
      {state === "failed" && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          X's timeline could not be shown here. It may be blocked by your browser or by X, so read the posts on X instead.
        </p>
      )}
      <a href={`https://x.com/${HANDLE}`} target="_blank" rel="noreferrer" className="mt-2 block text-center text-xs uppercase tracking-[0.2em] text-gold-deep">
        Open @{HANDLE} on X →
      </a>
    </div>
  );
}
