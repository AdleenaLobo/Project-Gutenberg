import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const ReaderThemeContext = createContext();

export function ReaderThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("reader-theme") || "light";
  });
  const [warmth, setWarmth] = useState(() => {
    const saved = localStorage.getItem("reader-warmth");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [fontFamily, setFontFamily] = useState(() => {
    return localStorage.getItem("reader-fontFamily") || "Georgia";
  });
  const [fontSize, _setFontSize] = useState(() => {
    const saved = localStorage.getItem("reader-fontSize");
    return saved !== null ? Math.max(14, parseInt(saved, 10)) : 20;
  });
  const setFontSize = (val) => {
    _setFontSize((prev) => {
      const next = typeof val === "function" ? val(prev) : val;
      return Math.max(14, next);
    });
  };
  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem("reader-lineHeight");
    return saved !== null ? parseFloat(saved) : 1.8;
  });
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem("reader-layoutMode") || "paginated";
  });

  useEffect(() => {
    localStorage.setItem("reader-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("reader-warmth", warmth.toString());
  }, [warmth]);

  useEffect(() => {
    localStorage.setItem("reader-fontFamily", fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem("reader-fontSize", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("reader-lineHeight", lineHeight.toString());
  }, [lineHeight]);

  useEffect(() => {
    localStorage.setItem("reader-layoutMode", layoutMode);
  }, [layoutMode]);

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
        className="min-h-screen bg-white text-zinc-900" 
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
