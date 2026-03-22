"use client";

import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ThemeName = "light" | "graphite" | "navy";

type ThemeOption = {
  name: ThemeName;
  label: string;
  swatches: [string, string, string];
};

type ThemeSwitcherProps = {
  compactOnMobile?: boolean;
};

const STORAGE_KEY = "banter-theme";

const themeOptions: ThemeOption[] = [
  {
    name: "light",
    label: "Light",
    swatches: ["#f2eadf", "#e07b33", "#2b69c8"]
  },
  {
    name: "graphite",
    label: "Dark",
    swatches: ["#070809", "#6dfe9c", "#c180ff"]
  },
  {
    name: "navy",
    label: "Midnight",
    swatches: ["#08111f", "#d95555", "#f0c84a"]
  }
];

function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

function getPreferredTheme(): ThemeName {
  const storedTheme = localStorage.getItem(STORAGE_KEY) as ThemeName | null;

  if (storedTheme && themeOptions.some((option) => option.name === storedTheme)) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "graphite" : "light";
}

export function ThemeSwitcher({ compactOnMobile = false }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("light");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setSelectedTheme(preferredTheme);
    document.documentElement.dataset.theme = preferredTheme;
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const activeTheme = themeOptions.find((option) => option.name === selectedTheme) ?? themeOptions[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`ghost-cta px-3 py-2.5 text-[0.68rem] ${compactOnMobile ? "min-w-0 sm:min-w-[148px] sm:px-4 sm:py-3" : "min-w-[148px] px-4 py-3"}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Palette className="h-4 w-4" />
        <span className={compactOnMobile ? "hidden sm:inline" : undefined}>{activeTheme.label}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.6rem)] z-50 min-w-[248px] overflow-hidden border border-subtle shell-panel p-2">
          <div className="grid gap-1" role="menu" aria-label="Theme picker">
            {themeOptions.map((option) => {
              const isSelected = option.name === selectedTheme;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(option.name);
                    applyTheme(option.name);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between gap-4 px-3 py-3 text-left transition ${
                    isSelected ? "bg-[color:var(--surface-high)]" : "bg-transparent hover:bg-[color:var(--ghost-bg)]"
                  }`}
                  role="menuitemradio"
                  aria-checked={isSelected}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-4 w-4 items-center justify-center">
                      {isSelected ? <Check className="h-4 w-4 text-[color:var(--primary)]" /> : null}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--text)]">
                      {option.label}
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    {option.swatches.map((swatch) => (
                      <span
                        key={swatch}
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ backgroundColor: swatch }}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
