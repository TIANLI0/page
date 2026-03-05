"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BookOpenText, Github, Mail, Smartphone } from "lucide-react";
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";
import {
  THEME_CACHE_STORAGE_KEY,
  THEME_DEFAULT_SEED,
  THEME_SEED_COLORS,
  THEME_SEED_STORAGE_KEY,
  THEME_SWATCH_CLASS,
} from "./theme-config";
import { SITE_CONFIG, type LinkIconKey } from "./site-config";

type ThemePalette = {
  primary: string;
  secondary: string;
  card: string;
  bg: string;
  bgs: string;
  bgfont: string;
  font1: string;
  font2: string;
  bga: string;
  font170: string;
  font250: string;
  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
  elevatedBorder: string;
  elevatedShadow: string;
};

type MaterialScheme = {
  primary: number;
  secondary: number;
  background: number;
  onBackground: number;
  surface: number;
  onSurface: number;
  surfaceVariant: number;
  onSurfaceVariant: number;
  outline: number;
  outlineVariant: number;
  primaryContainer: number;
  onPrimaryContainer: number;
  secondaryContainer: number;
  onSecondaryContainer: number;
};

function isHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function normalizeHex(value: string) {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return withHash.toUpperCase();
}

function formatNowTime() {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).format(new Date());
}

function renderLinkIcon(icon: LinkIconKey) {
  switch (icon) {
    case "github":
      return <Github size={26} strokeWidth={2.1} />;
    case "blog":
      return <BookOpenText size={26} strokeWidth={2.1} />;
    case "coolapk":
      return <Smartphone size={26} strokeWidth={2.1} />;
    default:
      return <BookOpenText size={26} strokeWidth={2.1} />;
  }
}

function rgba(hexColor: string, alpha: number) {
  const hex = hexColor.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => `${c}${c}`)
          .join("")
      : hex;

  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Home() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [nowTime, setNowTime] = useState("--:--");
  const [showFloatingScrollbar, setShowFloatingScrollbar] = useState(false);
  const hideScrollbarTimerRef = useRef<number | null>(null);
  const [seedColor, setSeedColor] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_SEED_STORAGE_KEY);
      if (stored && isHexColor(stored)) {
        return stored;
      }
    }

    return (
      THEME_SEED_COLORS[Math.floor(Math.random() * THEME_SEED_COLORS.length)] ??
      THEME_DEFAULT_SEED
    );
  });
  const [customColor, setCustomColor] = useState(seedColor);

  useEffect(() => {
    const updateNowTime = () => setNowTime(formatNowTime());
    const kickoff = window.setTimeout(updateNowTime, 0);
    const timer = window.setInterval(() => {
      updateNowTime();
    }, 60_000);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const updateFloatingScrollbar = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewportHeight = window.innerHeight;
      const scrollHeight = doc.scrollHeight;
      const scrollableHeight = Math.max(1, scrollHeight - viewportHeight);

      const trackTop = 32;
      const trackBottom = 32;
      const trackHeight = Math.max(1, viewportHeight - trackTop - trackBottom);

      const thumbHeight = Math.max(40, Math.round(trackHeight * (viewportHeight / scrollHeight)));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      const progress = Math.min(1, Math.max(0, scrollTop / scrollableHeight));
      const thumbTop = trackTop + Math.round(progress * thumbTravel);

      const root = document.documentElement;
      root.style.setProperty("--floating-scrollbar-top", `${thumbTop}px`);
      root.style.setProperty("--floating-scrollbar-height", `${thumbHeight}px`);
      setShowFloatingScrollbar(true);

      if (hideScrollbarTimerRef.current !== null) {
        window.clearTimeout(hideScrollbarTimerRef.current);
      }

      hideScrollbarTimerRef.current = window.setTimeout(() => {
        setShowFloatingScrollbar(false);
      }, 900);
    };

    const kickoff = window.setTimeout(updateFloatingScrollbar, 0);
    window.addEventListener("scroll", updateFloatingScrollbar, { passive: true });
    window.addEventListener("resize", updateFloatingScrollbar);

    return () => {
      window.clearTimeout(kickoff);
      if (hideScrollbarTimerRef.current !== null) {
        window.clearTimeout(hideScrollbarTimerRef.current);
      }
      window.removeEventListener("scroll", updateFloatingScrollbar);
      window.removeEventListener("resize", updateFloatingScrollbar);
    };
  }, []);

  useEffect(() => {
    const toHex = (value: number) => hexFromArgb(value);

    const buildPalette = (isDark: boolean): ThemePalette => {
      const theme = themeFromSourceColor(argbFromHex(seedColor));
      const scheme = (isDark ? theme.schemes.dark : theme.schemes.light) as MaterialScheme;
      const p = theme.palettes.primary;
      const n = theme.palettes.neutral;
      const nv = theme.palettes.neutralVariant;

      const font1 = toHex(scheme.onSurface);
      const font2 = toHex(scheme.onBackground);
      const font170 = rgba(font1, isDark ? 0.74 : 0.68);
      const font250 = rgba(font2, isDark ? 0.52 : 0.44);

      const palette = {
        // Use tonal surfaces to mimic Material 3 elevation layers in both light/dark schemes.
        primary: isDark ? toHex(n.tone(16)) : toHex(n.tone(94)),
        secondary: isDark ? toHex(nv.tone(22)) : toHex(nv.tone(90)),
        card: isDark ? toHex(nv.tone(28)) : toHex(nv.tone(86)),
        // Buttons and emphasized chips should be softer than primary-container accents.
        bg: toHex(scheme.secondaryContainer),
        bgs: isDark ? toHex(n.tone(10)) : toHex(n.tone(92)),
        bgfont: toHex(scheme.onSecondaryContainer),
        font1,
        font2,
        bga: isDark ? toHex(n.tone(8)) : toHex(n.tone(96)),
        font170,
        font250,
        scrollbarTrack: isDark ? toHex(nv.tone(24)) : toHex(nv.tone(92)),
        scrollbarThumb: isDark ? toHex(nv.tone(40)) : toHex(nv.tone(70)),
        scrollbarThumbHover: isDark ? toHex(p.tone(70)) : toHex(p.tone(60)),
        elevatedBorder: rgba(toHex(scheme.outline), isDark ? 0.36 : 0.24),
        elevatedShadow: isDark
          ? "0 16px 32px rgba(0, 0, 0, 0.4)"
          : "0 18px 36px rgba(0, 0, 0, 0.2)",
      };

      return palette;
    };

    const applyPalette = (palette: ThemePalette) => {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", palette.primary);
      root.style.setProperty("--color-secondary", palette.secondary);
      root.style.setProperty("--color-card", palette.card);
      root.style.setProperty("--color-bg", palette.bg);
      root.style.setProperty("--color-bgs", palette.bgs);
      root.style.setProperty("--color-bgfont", palette.bgfont);
      root.style.setProperty("--color-font1", palette.font1);
      root.style.setProperty("--color-font2", palette.font2);
      root.style.setProperty("--color-bga", palette.bga);
      root.style.setProperty("--color-font1-70", palette.font170);
      root.style.setProperty("--color-font2-50", palette.font250);
      root.style.setProperty("--scrollbar-track-color", palette.scrollbarTrack);
      root.style.setProperty("--scrollbar-thumb-color", palette.scrollbarThumb);
      root.style.setProperty("--scrollbar-thumb-hover-color", palette.scrollbarThumbHover);
      root.style.setProperty("--elevated-border", palette.elevatedBorder);
      root.style.setProperty("--elevated-shadow", palette.elevatedShadow);
      root.style.setProperty("--theme-seed", seedColor);
    };

    const lightPalette = buildPalette(false);
    const darkPalette = buildPalette(true);
    localStorage.setItem(THEME_SEED_STORAGE_KEY, seedColor);
    localStorage.setItem(
      THEME_CACHE_STORAGE_KEY,
      JSON.stringify({
        seed: seedColor,
        light: {
          "--color-primary": lightPalette.primary,
          "--color-secondary": lightPalette.secondary,
          "--color-card": lightPalette.card,
          "--color-bg": lightPalette.bg,
          "--color-bgs": lightPalette.bgs,
          "--color-bgfont": lightPalette.bgfont,
          "--color-font1": lightPalette.font1,
          "--color-font2": lightPalette.font2,
          "--color-bga": lightPalette.bga,
          "--color-font1-70": lightPalette.font170,
          "--color-font2-50": lightPalette.font250,
          "--scrollbar-track-color": lightPalette.scrollbarTrack,
          "--scrollbar-thumb-color": lightPalette.scrollbarThumb,
          "--scrollbar-thumb-hover-color": lightPalette.scrollbarThumbHover,
          "--elevated-border": lightPalette.elevatedBorder,
          "--elevated-shadow": lightPalette.elevatedShadow,
        },
        dark: {
          "--color-primary": darkPalette.primary,
          "--color-secondary": darkPalette.secondary,
          "--color-card": darkPalette.card,
          "--color-bg": darkPalette.bg,
          "--color-bgs": darkPalette.bgs,
          "--color-bgfont": darkPalette.bgfont,
          "--color-font1": darkPalette.font1,
          "--color-font2": darkPalette.font2,
          "--color-bga": darkPalette.bga,
          "--color-font1-70": darkPalette.font170,
          "--color-font2-50": darkPalette.font250,
          "--scrollbar-track-color": darkPalette.scrollbarTrack,
          "--scrollbar-thumb-color": darkPalette.scrollbarThumb,
          "--scrollbar-thumb-hover-color": darkPalette.scrollbarThumbHover,
          "--elevated-border": darkPalette.elevatedBorder,
          "--elevated-shadow": darkPalette.elevatedShadow,
        },
      })
    );

    const applyDynamicTheme = (isDark: boolean) => {
      applyPalette(isDark ? darkPalette : lightPalette);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    applyDynamicTheme(media.matches);

    const updateTheme = (event: MediaQueryListEvent) => {
      applyDynamicTheme(event.matches);
    };

    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [seedColor]);

  const applySeed = (value: string) => {
    if (!isHexColor(value)) {
      return;
    }

    setSeedColor(value);
    setCustomColor(value);
  };

  const applyCustomSeed = () => {
    const normalized = normalizeHex(customColor);
    if (!isHexColor(normalized)) {
      return;
    }

    applySeed(normalized);
  };

  const randomizeSeed = () => {
    const randomSeed =
      THEME_SEED_COLORS[Math.floor(Math.random() * THEME_SEED_COLORS.length)] ??
      THEME_DEFAULT_SEED;
    applySeed(randomSeed);
  };

  return (
    <div className="bg-hex-1A1D1A min-h-100vh flex flex-col">
      <header className="svelte-1ena5bt">
        <div className="mx-auto max-w-1024px py-60px md:py-80px xl:py-120px px-20px">
          <div className="flex flex-col gap-30px items-start">
            <svg
              width="182"
              height="182"
              viewBox="0 0 182 182"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              className="w-120px h-120px md:w-150px md:h-150px lg:w-180px lg:h-180px"
            >
              <path
                d="M65.8329 7.61157C81.0982 -2.46432 100.902 -2.46432 116.167 7.61157V7.61157C121.03 10.8211 126.461 13.0708 132.169 14.2397V14.2397C150.088 17.9091 164.091 31.9124 167.76 49.8313V49.8313C168.929 55.539 171.179 60.9705 174.388 65.8329V65.8329C184.464 81.0982 184.464 100.902 174.388 116.167V116.167C171.179 121.03 168.929 126.461 167.76 132.169V132.169C164.091 150.088 150.088 164.091 132.169 167.76V167.76C126.461 168.929 121.03 171.179 116.167 174.388V174.388C100.902 184.464 81.0982 184.464 65.8329 174.388V174.388C60.9705 171.179 55.539 168.929 49.8313 167.76V167.76C31.9124 164.091 17.9091 150.088 14.2397 132.169V132.169C13.0708 126.461 10.8211 121.03 7.61157 116.167V116.167C-2.46432 100.902 -2.46432 81.0982 7.61157 65.8329V65.8329C10.8211 60.9705 13.0708 55.539 14.2397 49.8313V49.8313C17.9091 31.9124 31.9123 17.9091 49.8313 14.2397V14.2397C55.539 13.0708 60.9705 10.8211 65.8329 7.61157V7.61157Z"
                fill="#C4C4C4"
              />
              <path
                d="M65.8329 7.61157C81.0982 -2.46432 100.902 -2.46432 116.167 7.61157V7.61157C121.03 10.8211 126.461 13.0708 132.169 14.2397V14.2397C150.088 17.9091 164.091 31.9124 167.76 49.8313V49.8313C168.929 55.539 171.179 60.9705 174.388 65.8329V65.8329C184.464 81.0982 184.464 100.902 174.388 116.167V116.167C171.179 121.03 168.929 126.461 167.76 132.169V132.169C164.091 150.088 150.088 164.091 132.169 167.76V167.76C126.461 168.929 121.03 171.179 116.167 174.388V174.388C100.902 184.464 81.0982 184.464 65.8329 174.388V174.388C60.9705 171.179 55.539 168.929 49.8313 167.76V167.76C31.9124 164.091 17.9091 150.088 14.2397 132.169V132.169C13.0708 126.461 10.8211 121.03 7.61157 116.167V116.167C-2.46432 100.902 -2.46432 81.0982 7.61157 65.8329V65.8329C10.8211 60.9705 13.0708 55.539 14.2397 49.8313V49.8313C17.9091 31.9124 31.9123 17.9091 49.8313 14.2397V14.2397C55.539 13.0708 60.9705 10.8211 65.8329 7.61157V7.61157Z"
                fill="url(#pattern0)"
              />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use xlinkHref="#image0_14_11" transform="scale(0.00138889)" />
                </pattern>
                <image
                  id="image0_14_11"
                  width="720"
                  height="720"
                  xlinkHref={SITE_CONFIG.profile.avatarUrl}
                />
              </defs>
            </svg>

            <div className="flex flex-col gap-20px">
              <h1 className="text-36px font-extrabold text-hex-fff">{SITE_CONFIG.profile.name}</h1>
              <h2 className="text-18px text-hex-fff text-opacity-50 leading-7">
                {SITE_CONFIG.profile.title}
              </h2>
            </div>

            <div className="flex rounded-full bg-hex-383934 py-8px px-8px md:py-10px md:px-10px text-14px">
              <a
                href={`mailto:${SITE_CONFIG.profile.email}`}
                className="flex gap-15px rounded-full bg-hex-D9EAD7 py-8px px-15px md:py-10px md:px-20px items-center text-hex-363C33"
              >
                <Mail size={22} strokeWidth={2} />
                <span className="text-hex-363C33 font-bold">
                  {SITE_CONFIG.profile.email}
                </span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="main bg-hex-EDEFE3 rounded-t-50px flex-1 py-15px pb-50px lg:py-50px svelte-16y6iu1">
        <div className="mx-auto max-w-1024px px-10px lg:px-20px gap-40px flex flex-col">
          <section className="flex flex-col bg-hex-FCF9EF px-30px py-40px lg:p-40px gap-20px rounded-50px">
            <div className="flex items-center justify-between">
              <span className="uppercase font-bold text-18px text-hex-000">
                Links
              </span>
            </div>
            <div className="grid gap-20px md:grid-cols-2 lg:grid-cols-3">
              {SITE_CONFIG.links.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="bg-hex-F6F3D4 rounded-20px lg:rounded-30px py-20px px-30px flex gap-30px items-center"
                  target="_blank"
                  rel="me noopener noreferrer"
                >
                  <div className="icon svelte-1kp182d text-hex-000">{renderLinkIcon(item.icon)}</div>
                  <div className="flex flex-col gap-5px">
                    <span className="font-bold text-18px text-hex-000">
                      {item.title}
                    </span>
                    <span className="font-semibold tracking-wider text-11px opacity-70">
                      {item.subtitle}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="flex flex-col bg-hex-FCF9EF px-30px py-40px lg:p-40px gap-20px rounded-50px">
            <div className="flex items-center justify-between">
              <span className="uppercase font-bold text-18px text-hex-000">
                Projects
              </span>
            </div>
            <div className="gap-20px grid md:grid-cols-2 lg:grid-cols-3">
              {SITE_CONFIG.projects.map((project) => (
                <a
                  key={project.title}
                  className="bg-hex-F6F3D4 flex flex-col rounded-40px overflow-hidden"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="h-100px object-cover w-full"
                    src={project.img}
                    alt={project.desc}
                    width={512}
                    height={100}
                  />
                  <div className="uppercase flex flex-col p-20px px-25px flex-1 text-hex-000">
                    <span className="font-bold text-hex-000">
                      {project.title}
                    </span>
                    <span className="font-semibold text-xs leading-5 opacity-70">
                      {project.desc}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="flex flex-col bg-hex-FCF9EF px-30px py-40px lg:p-40px gap-20px rounded-50px">
            <div className="flex items-center justify-between">
              <span className="uppercase font-bold text-18px text-hex-000">Now</span>
            </div>
            <div className="now-grid">
              {SITE_CONFIG.now.map((item) => (
                <article key={item.label} className="now-item bg-hex-F6F3D4">
                  <span className="now-label">{item.label}</span>
                  <span className="now-value">
                    {"value" in item ? item.value : `${item.valuePrefix} · ${nowTime}`}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <div className="beian">
            <a
              target="_blank"
              rel="noopener external nofollow noreferrer"
              href="http://beian.miit.gov.cn/"
            >
              {SITE_CONFIG.beian}
            </a>
          </div>
        </div>
      </div>

      <div className="theme-fab-wrap">
        {isPickerOpen ? (
          <div className="theme-panel" role="dialog" aria-label="Material You color picker">
            <span className="theme-panel-title">Material You</span>
            <span className="theme-panel-subtitle">Choose your seed color</span>

            <div className="theme-swatch-grid">
              {THEME_SEED_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`theme-swatch ${THEME_SWATCH_CLASS[color] ?? ""} ${seedColor === color ? "is-active" : ""}`}
                  onClick={() => applySeed(color)}
                  aria-label={`Use ${color}`}
                />
              ))}
            </div>

            <div className="theme-custom-row">
              <input
                type="color"
                className="theme-native-picker"
                value={customColor}
                onChange={(event) => setCustomColor(event.target.value.toUpperCase())}
                aria-label="Pick custom color"
              />
              <input
                type="text"
                className="theme-hex-input"
                value={customColor}
                onChange={(event) => setCustomColor(event.target.value)}
                placeholder="#5B8DEF"
                maxLength={7}
                aria-label="Custom hex color"
              />
            </div>

            <div className="theme-actions">
              <button type="button" className="theme-action-btn" onClick={applyCustomSeed}>
                Apply
              </button>
              <button type="button" className="theme-action-btn secondary" onClick={randomizeSeed}>
                Random
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className="theme-fab"
          onClick={() => setIsPickerOpen((open) => !open)}
          aria-label="Toggle Material You color picker"
        >
          <span className="theme-fab-dot" />
          <span className="theme-fab-label">Theme</span>
        </button>
      </div>

      <div className={`floating-scrollbar ${showFloatingScrollbar ? "is-visible" : ""}`}>
        <div className="floating-scrollbar-thumb" />
      </div>
    </div>
  );
}
