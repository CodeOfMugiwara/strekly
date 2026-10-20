"use client";

import { useEffect, useRef } from "react";
import { insforge } from "@/lib/insforge-client";
import { useTheme } from "@/components/layout/ThemeProvider";

export function ProfileThemeSync() {
  const { hydrateFromProfile } = useTheme();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    (async () => {
      try {
        const { data } = await insforge.auth.getCurrentUser();
        if (cancelled || !data?.user) return;
        await hydrateFromProfile();
      } catch (error) {
        console.error("[ProfileThemeSync]", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromProfile]);

  return null;
}
