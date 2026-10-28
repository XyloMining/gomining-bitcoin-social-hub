import { useEffect, useRef, useState } from "react";

type Twttr = {
  widgets?: {
    createTimeline: (
      source: { sourceType: "profile"; screenName: string },
      el: HTMLElement,
      opts?: Record<string, unknown>,
    ) => Promise<HTMLElement | undefined>;
  };
};
declare global {
  interface Window { twttr?: Twttr }
}

const HANDLE = "Xylo_mining";
const SCRIPT = "https://platform.twitter.com/widgets.js";
const GIVE_UP_MS = 10_000;

let loading: Promise<Twttr["widgets"]> | null = null;

/** Load X's widgets.js once and resolve when its widgets API is ready. Rejects if it is blocked or never arrives. */
function loadWidgets(): Promise<Twttr["widgets"]> {
  if (window.twttr?.widgets?.createTimeline) return Promise.resolve(window.twttr.widgets);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => {
      const t = Date.now();
      const wait = () => {
        if (window.twttr?.widgets?.createTimeline) resolve(window.twttr.widgets);
        else if (Date.now() - t > GIVE_UP_MS) reject(new Error("widgets not ready"));
        else setTimeout(wait, 100);
      };
      wait();
    };
    s.onerror = () => { loading = null; s.remove(); reject(new Error("widgets.js blocked")); };
    document.body.appendChild(s);
  });
  return loading;
}

/**
 * X profile timeline. X only shows it to some logged-out visitors, and ad blockers stop the script,
 * so when it does not appear within a few seconds a plain link to the profile is shown instead.
 */
export function XTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ok" | "failed">("loading");

  useEffect(() => {
    let off = false;
    const el = ref.current;
    const timer = setTimeout(() => { if (!off) setState((s) => (s === "ok" ? s : "failed")); }, GIVE_UP_MS);
    const dark = document.documentElement.classList.contains("dark");
    loadWidgets()
      .then((w) => {
        if (off || !el || !w) return undefined;
        el.innerHTML = "";
        return w.createTimeline({ sourceType: "profile", screenName: HANDLE }, el, {
          height: 700, chrome: "noheader nofooter transparent", theme: dark ? "dark" : "light", dnt: true,
        });
      })
      .then((made) => { if (!off) setState(made ? "ok" : "failed"); })
      .catch(() => { if (!off) setState("failed"); });
    return () => { off = true; clearTimeout(timer); if (el) el.innerHTML = ""; };
  }, []);

  return (
    <div className="border border-border bg-card p-4">
      <div ref={ref} className={state === "failed" ? "hidden" : ""} aria-live="polite" />
      {state === "loading" && <p className="py-6 text-center text-sm text-muted-foreground">Loading posts from X...</p>}
      {state === "failed" && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          X's timeline could not be shown here. It may be blocked by your browser or by X. You can still read the posts on X.
        </p>
      )}
      <a href={`https://x.com/${HANDLE}`} target="_blank" rel="noreferrer" className="mt-2 block text-center text-xs uppercase tracking-[0.2em] text-gold-deep">
        Open @{HANDLE} on X →
      </a>
    </div>
  );
}
