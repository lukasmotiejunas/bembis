// Svetainės dizainas, kurį perjungia administratorius (/admin). Kalėdinis — numatytasis.
export const siteThemes = ["christmas", "halloween"] as const;
export type SiteTheme = (typeof siteThemes)[number];

export const DEFAULT_THEME: SiteTheme = "christmas";

export const themeOptions: Record<SiteTheme, { label: string; text: string }> = {
  christmas: {
    label: "Kalėdinis",
    text: "Dabartinis dizainas: šiltos girliandos, žalia ir kreminė spalvos, kalėdiniai tekstai.",
  },
  halloween: {
    label: "Helovynas",
    text: "Naktinis dizainas: moliūgai, šikšnosparniai, voratinkliai ir Helovyno tekstai.",
  },
};

export const isSiteTheme = (value: unknown): value is SiteTheme =>
  siteThemes.includes(value as SiteTheme);
