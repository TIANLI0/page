export const THEME_SEED_COLORS = [
  "#5B8DEF",
  "#42A5F5",
  "#26A69A",
  "#66BB6A",
  "#FF8A65",
  "#EC407A",
  "#AB47BC",
  "#7E57C2",
] as const;

export const THEME_SWATCH_CLASS: Record<string, string> = {
  "#5B8DEF": "theme-color-1",
  "#42A5F5": "theme-color-2",
  "#26A69A": "theme-color-3",
  "#66BB6A": "theme-color-4",
  "#FF8A65": "theme-color-5",
  "#EC407A": "theme-color-6",
  "#AB47BC": "theme-color-7",
  "#7E57C2": "theme-color-8",
};

export const THEME_DEFAULT_SEED = "#5B8DEF";
export const THEME_SEED_STORAGE_KEY = "material-you-seed";
export const THEME_CACHE_STORAGE_KEY = "material-you-palette-cache";

export function getThemeBootstrapScript() {
  return `(() => {
    try {
      const raw = localStorage.getItem('${THEME_CACHE_STORAGE_KEY}');
      if (!raw) return;
      const cache = JSON.parse(raw);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const palette = prefersDark ? cache.dark : cache.light;
      if (!palette) return;
      const root = document.documentElement;
      for (const key in palette) {
        root.style.setProperty(key, palette[key]);
      }
      if (cache.seed) {
        root.style.setProperty('--theme-seed', cache.seed);
      }
    } catch (e) {
      // Ignore malformed cache and continue with app initialization.
    }
  })();`;
}
