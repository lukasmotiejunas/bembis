"use client";
import { createContext, use } from "react";
import { DEFAULT_THEME, SiteTheme } from "@/lib/theme";

// Server components read the design with getSiteTheme(); client components get it from here.
const SiteThemeContext = createContext<SiteTheme>(DEFAULT_THEME);

export function SiteThemeProvider({
  theme,
  children,
}: {
  theme: SiteTheme;
  children: React.ReactNode;
}) {
  return <SiteThemeContext value={theme}>{children}</SiteThemeContext>;
}

export const useSiteTheme = () => use(SiteThemeContext);
