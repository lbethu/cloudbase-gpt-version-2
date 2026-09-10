"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";
const KEY = "cloudbase.theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    try {
      const saved = (window.localStorage.getItem(KEY) as Theme | null) ?? "system";
      apply(saved);
      setTheme(saved);
    } catch {
      /* ignore */
    }
  }, []);
  const apply = (t: Theme) => {
    const root = document.documentElement;
    if (t === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", t);
  };
  const next = () => {
    const order: Theme[] = ["system", "light", "dark"];
    const t = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(t);
    apply(t);
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  };
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  return (
    <button className="cb-icon-btn" onClick={next} aria-label={`Theme: ${theme}. Click to change.`} title={`Theme: ${theme}`}>
      <Icon size={16} />
    </button>
  );
}
