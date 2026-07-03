import React, { createContext, useContext, useMemo, useState } from "react";

const ReaderThemeContext = createContext();

export function ReaderThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [warmth, setWarmth] = useState(0); // Set default warmth to 0 for monochrome, can be adjusted via slider
  const [fontFamily, setFontFamily] = useState("Georgia");
  const [fontSize, _setFontSize] = useState(20);
  const setFontSize = (val) => {
    _setFontSize((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      return Math.max(14, next);
    });
  };
  const [lineHeight, setLineHeight] = useState(1.8);
  const [layoutMode, setLayoutMode] = useState("paginated"); // "paginated" | "scroll"

  const style = useMemo(() => {
    return {
      "--reader-font": fontFamily,
      "--reader-font-size": `${fontSize}px`,
      "--reader-line-height": lineHeight,
      "--reader-warmth": warmth / 100,
    };
  }, [fontFamily, fontSize, lineHeight, warmth]);

  const value = {
    theme,
    setTheme,

    warmth,
    setWarmth,

    fontFamily,
    setFontFamily,

    fontSize,
    setFontSize,

    lineHeight,
    setLineHeight,

    layoutMode,
    setLayoutMode,
  };

  return (
    <ReaderThemeContext.Provider value={value}>
      <div 
        className={`min-h-screen transition-colors duration-200 ${theme === "dark" ? "dark bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"}`} 
        style={style}
      >
        {children}
      </div>
    </ReaderThemeContext.Provider>
  );
}

export function useReaderTheme() {
  const context = useContext(ReaderThemeContext);

  if (!context) {
    throw new Error("useReaderTheme must be used inside ReaderThemeProvider");
  }

  return context;
}
