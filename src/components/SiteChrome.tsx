import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BRAND, socials } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

/** The mobile menu groups the pages; the desktop bar shows them flat in the same order. */
const GROUPS = [
  { title: "Follow", items: [{ to: "/socials/", label: "Socials" }, { to: "/articles/", label: "Articles" }] },
  { title: "Learn", items: [{ to: "/guides/", label: "Guides" }, { to: "/calculator/", label: "Calculator" }] },
  { title: "My numbers", items: [{ to: "/results/", label: "My results" }, { to: "/stats/", label: "Stats" }] },
  { title: "Support", items: [{ to: "/referrals/", label: "Referrals" }] },
] as const;
const NAV = GROUPS.flatMap((g) => [...g.items]);

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const link = "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors";
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-2xl" onClick={() => setOpen(false)}>
          Xylo <span className="text-gold-gradient italic">Mining</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={link} activeProps={{ className: "text-foreground" }}>{n.label}</Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-foreground"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border lg:hidden">
          <div className="mx-auto max-w-6xl space-y-6 px-5 py-6">
            {GROUPS.map((g) => (
              <section key={g.title} aria-labelledby={`menu-${g.title}`}>
                <h2 id={`menu-${g.title}`} className="eyebrow mb-1">{g.title}</h2>
                <ul>
                  {g.items.map((n) => (
                    <li key={n.to} className="border-b border-border last:border-b-0">
                      <Link
                        to={n.to}
                        onClick={() => setOpen(false)}
                        className="block py-3.5 font-display text-2xl text-muted-foreground"
                        activeProps={{ className: "text-foreground" }}
                      >
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section aria-labelledby="menu-find">
              <h2 id="menu-find" className="eyebrow mb-3">Find me on</h2>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-gold-deep">{s.name}</a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-xl">{BRAND}</p>
        <div className="flex flex-wrap gap-5">
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-gold-deep">
              {s.name}
            </a>
          ))}
        </div>
      </div>
      <p className="px-5 pb-8 text-center text-xs text-muted-foreground">
        Not financial advice. Referral links may earn me a reward at no cost to you.
      </p>
    </footer>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-4xl sm:text-5xl">{title}</h2>
    </div>
  );
}
