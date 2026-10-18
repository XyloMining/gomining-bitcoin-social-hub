import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Mode = "system" | "light" | "dark";
const order: Mode[] = ["system", "light", "dark"];

function apply(mode: Mode) {
  const dark = mode === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : mode === "dark";
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Mode | null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  useEffect(() => {
    apply(mode);
    if (mode !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => apply("system");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode]);

  const next = () => {
    const m = order[(order.indexOf(mode) + 1) % order.length]!;
    if (m === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", m);
    setMode(m);
  };

  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;
  return (
    <button onClick={next} aria-label={`Theme: ${mode}`} title={`Theme: ${mode}`} className="text-muted-foreground transition-colors hover:text-gold-deep">
      <Icon className="h-4 w-4" />
    </button>
  );
}
