"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { loadAppearance, saveAppearance } from "@/actions/settings";
import type { ColorTheme, ThemeMode } from "@/types";

type ResolvedTheme = "light" | "dark";

export type AppearancePersistStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

type ThemeContextValue = {
  themeMode: ThemeMode;
  colorTheme: ColorTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  resolvedTheme: ResolvedTheme;
  hydrateFromProfile: () => Promise<void>;
  persistStatus: AppearancePersistStatus;
  persistError: string | null;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_THEME = "ht_theme_mode";
const STORAGE_COLOR = "ht_color_theme";

const VALID_MODES: ThemeMode[] = ["light", "dark", "system"];
const VALID_COLORS: ColorTheme[] = [
  "lavender",
  "mint",
  "peach",
  "ocean",
  "rose",
  "sage",
  "clay",
  "lagoon",
  "berry",
  "orchid",
];

let mode: ThemeMode = "light";
let color: ColorTheme = "lavender";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getModeSnapshot(): ThemeMode {
  return mode;
}

function getColorSnapshot(): ColorTheme {
  return color;
}

function getServerSnapshot(): ThemeMode {
  return "light";
}

function getServerColorSnapshot(): ColorTheme {
  return "lavender";
}

function parseMode(value: string | null): ThemeMode | null {
  return value && (VALID_MODES as string[]).includes(value)
    ? (value as ThemeMode)
    : null;
}

function parseColor(value: string | null): ColorTheme | null {
  return value && (VALID_COLORS as string[]).includes(value)
    ? (value as ColorTheme)
    : null;
}

function readStored() {
  if (typeof window === "undefined") return;
  mode = parseMode(localStorage.getItem(STORAGE_THEME)) ?? "light";
  color = parseColor(localStorage.getItem(STORAGE_COLOR)) ?? "lavender";
}

function resolve(modeValue: ThemeMode): ResolvedTheme {
  if (modeValue === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return modeValue;
}

function applyDom(modeValue: ThemeMode, colorValue: ColorTheme) {
  const root = document.documentElement;
  const resolved = resolve(modeValue);
  root.dataset.theme = resolved;
  root.dataset.colorTheme = colorValue;
  root.style.colorScheme = resolved;
  return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useSyncExternalStore(subscribe, getModeSnapshot, getServerSnapshot);
  const colorTheme = useSyncExternalStore(
    subscribe,
    getColorSnapshot,
    getServerColorSnapshot,
  );
  const persistEnabled = useRef(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [persistStatus, setPersistStatus] =
    useState<AppearancePersistStatus>("idle");
  const [persistError, setPersistError] = useState<string | null>(null);

  useEffect(() => {
    readStored();
    emit();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyDom(themeMode, colorTheme);
  }, [themeMode, colorTheme]);

  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyDom("system", colorTheme);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [themeMode, colorTheme]);

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, []);

  const persist = useCallback(
    (modeValue: ThemeMode, colorValue: ColorTheme) => {
      if (persistTimer.current) clearTimeout(persistTimer.current);

      setPersistStatus("saving");
      setPersistError(null);

      persistTimer.current = setTimeout(() => {
        void saveAppearance({
          themeMode: modeValue,
          colorTheme: colorValue,
        })
          .then((result) => {
            if (result.success) {
              setPersistStatus("saved");
              setPersistError(null);
            } else {
              setPersistStatus("error");
              setPersistError(
                result.error ?? "Could not sync theme to your profile",
              );
            }
          })
          .catch((error) => {
            console.error("[ThemeProvider/persist]", error);
            setPersistStatus("error");
            setPersistError("Could not sync theme to your profile");
          });
      }, 300);
    },
    [],
  );

  const setThemeMode = useCallback(
    (next: ThemeMode) => {
      mode = next;
      localStorage.setItem(STORAGE_THEME, next);
      emit();
      if (persistEnabled.current) {
        persist(mode, color);
      }
    },
    [persist],
  );

  const setColorTheme = useCallback(
    (next: ColorTheme) => {
      color = next;
      localStorage.setItem(STORAGE_COLOR, next);
      emit();
      if (persistEnabled.current) {
        persist(mode, color);
      }
    },
    [persist],
  );

  const hydrateFromProfile = useCallback(async () => {
    const storedMode = parseMode(localStorage.getItem(STORAGE_THEME));
    const storedColor = parseColor(localStorage.getItem(STORAGE_COLOR));

    if (!storedMode || !storedColor) {
      const result = await loadAppearance();
      if (result.success) {
        if (!storedMode && result.themeMode) {
          mode = result.themeMode;
          localStorage.setItem(STORAGE_THEME, result.themeMode);
        }
        if (!storedColor && result.colorTheme) {
          color = result.colorTheme;
          localStorage.setItem(STORAGE_COLOR, result.colorTheme);
        }
        emit();
      }
    }

    persistEnabled.current = true;
  }, []);

  const resolvedTheme: ResolvedTheme =
    typeof window === "undefined"
      ? "light"
      : themeMode === "system"
        ? resolve("system")
        : themeMode;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorTheme,
        setThemeMode,
        setColorTheme,
        resolvedTheme,
        hydrateFromProfile,
        persistStatus,
        persistError,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
