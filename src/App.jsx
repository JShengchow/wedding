import { useEffect, useState } from "react";
import { ThemeWheel } from "./components/ThemeWheel";
import { Countdown } from "./sections/Countdown";
import { Details } from "./sections/Details";
import { FeaturePhotos } from "./sections/FeaturePhotos";
import { Footer } from "./sections/Footer";
import { Gallery } from "./sections/Gallery";
import { Hero } from "./sections/Hero";
import { Invitation } from "./sections/Invitation";
import { OurStory } from "./sections/OurStory";
import { RsvpForm } from "./sections/RsvpForm";
import { Schedule } from "./sections/Schedule";
import { Vow } from "./sections/Vow";

const THEME_STORAGE_KEY = "wedding-theme";

const THEMES = [
  {
    id: "bloom",
    label: "Bloom 暮光烟粉",
    labelShort: "烟粉",
    preview: ["#d48d9a", "#9d5a68"],
  },
  {
    id: "ink",
    label: "Ink 墨韵东方",
    labelShort: "墨韵",
    preview: ["#a53d2f", "#7f2d22"],
  },
  {
    id: "noir",
    label: "Noir 杂志典雅",
    labelShort: "黑金",
    preview: ["#d5b078", "#0f0f0f"],
  },
  {
    id: "forest",
    label: "Forest 白绿森系",
    labelShort: "森系",
    preview: ["#6e9969", "#dfeedd"],
  },
  {
    id: "violet",
    label: "Violet 紫色梦境",
    labelShort: "紫梦",
    preview: ["#9d78d8", "#6f4ba8"],
  },
];

const THEME_IDS = new Set(THEMES.map((item) => item.id));

function getInitialTheme() {
  if (typeof window === "undefined") return THEMES[0].id;

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme && THEME_IDS.has(savedTheme)) {
    return savedTheme;
  }
  return THEMES[0].id;
}

export default function WeddingInvitationH5() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div
      className={`theme-app theme-${theme} relative min-h-screen overflow-hidden bg-ivory text-ink`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-petal-radial opacity-70"
      />

      <ThemeWheel themes={THEMES} activeTheme={theme} onChange={setTheme} />

      <Hero />
      <Countdown />
      <Invitation />
      <OurStory />
      <Details />
      <Schedule />
      <Vow />
      <RsvpForm />
      <FeaturePhotos />
      <Gallery />
      <Footer />
    </div>
  );
}
