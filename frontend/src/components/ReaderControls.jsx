import React, { useEffect, useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  List,
  ArrowLeft,
} from "lucide-react";

import { useReaderTheme } from "../context/ReaderThemeContext";
import CustomSelect from "./ui/CustomSelect";

export default function ReaderControls({
  pageIndex,
  totalPages,
  onPrevious,
  onNext,
  onOpenChapters,
  onBack,
}) {
  const {
    theme,
    setTheme,
    warmth,
    setWarmth,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    lineHeight,
    layoutMode,
    setLayoutMode,
  } = useReaderTheme();

  const [visible, setVisible] = useState(true);
  const [hoveringControl, setHoveringControl] = useState(false);
  const [showReaderSettings, setShowReaderSettings] = useState(false);
  const panelRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error toggling fullscreen focus mode:", err);
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowReaderSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let timeout;
    const showControls = () => {
      setVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!hoveringControl) {
          setVisible(false);
        }
      }, 2000);
    };
    window.addEventListener("mousemove", showControls);
    showControls();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", showControls);
    };
  }, [hoveringControl]);

  const showUI = visible || hoveringControl;

  const btnBase = "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-250 fixed z-50 focus:outline-none";
  const btnActive = showUI
    ? "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white hover:scale-105 cursor-pointer shadow-none focus:outline-none focus:ring-0 focus:border-zinc-300 dark:focus:border-zinc-700"
    : "border-transparent bg-transparent text-transparent shadow-none pointer-events-none";

  const iconOpacity = showUI ? "opacity-100" : "opacity-0 pointer-events-none";

  return (
    <>
      {/* Chapters */}
      <button
        onClick={onOpenChapters}
        onMouseEnter={() => setHoveringControl(true)}
        onMouseLeave={() => setHoveringControl(false)}
        aria-label="Table of contents"
        className={`${btnBase} ${btnActive} left-7 top-6`}
      >
        <List size={20} className={`transition-all duration-200 ${iconOpacity}`} />
      </button>

      {/* Previous */}
      {layoutMode !== "scroll" && (
        <button
          disabled={pageIndex === 0}
          onClick={onPrevious}
          onMouseEnter={() => setHoveringControl(true)}
          onMouseLeave={() => setHoveringControl(false)}
          className={`${btnBase} ${btnActive} left-7 top-1/2 -translate-y-1/2 disabled:opacity-20 disabled:cursor-not-allowed`}
        >
          <ChevronLeft size={24} className={`transition-all duration-200 ${iconOpacity}`} />
        </button>
      )}

      {/* Next */}
      {layoutMode !== "scroll" && (
        <button
          disabled={pageIndex >= totalPages - 1}
          onClick={onNext}
          onMouseEnter={() => setHoveringControl(true)}
          onMouseLeave={() => setHoveringControl(false)}
          className={`${btnBase} ${btnActive} right-7 top-1/2 -translate-y-1/2 disabled:opacity-20 disabled:cursor-not-allowed`}
        >
          <ChevronRight size={24} className={`transition-all duration-200 ${iconOpacity}`} />
        </button>
      )}

      {/* Page Number */}
      {layoutMode !== "scroll" && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-300 dark:border-zinc-700 rounded-full text-sm font-medium tracking-wider text-zinc-955 dark:text-white shadow-md pointer-events-none transition-opacity duration-350 z-50 font-serif ${
            showUI ? "opacity-100" : "opacity-0"
          }`}
        >
          {pageIndex + 1} / {totalPages}
        </div>
      )}

      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          onMouseEnter={() => setHoveringControl(true)}
          onMouseLeave={() => setHoveringControl(false)}
          aria-label="Go back"
          className={`${btnBase} ${btnActive} left-7 bottom-6`}
        >
          <ArrowLeft size={20} className={`transition-all duration-200 ${iconOpacity}`} />
        </button>
      )}

      {/* Aa Text Panel Button */}
      <button
        onClick={() => setShowReaderSettings((prev) => !prev)}
        onMouseEnter={() => setHoveringControl(true)}
        onMouseLeave={() => setHoveringControl(false)}
        aria-label="Text control panel"
        className={`${btnBase} ${btnActive} right-7 bottom-6`}
      >
        <span
          className={`text-base font-bold transition-all duration-200 ${iconOpacity}`}
        >
          Aa
        </span>
      </button>

      {showReaderSettings && (
        <div
          ref={panelRef}
          onMouseEnter={() => setHoveringControl(true)}
          onMouseLeave={() => setHoveringControl(false)}
          className="fixed bottom-20 right-7 z-50 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl transition-all duration-300 origin-bottom-right scale-100 p-6 flex flex-col gap-5 text-zinc-800 dark:text-zinc-200"
        >
          <div className="flex flex-col gap-5">
            {/* Font */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Font
              </label>
              <CustomSelect
                value={fontFamily}
                onChange={setFontFamily}
                options={[
                  "Georgia",
                  "Merriweather",
                  "Bookerly",
                  "Inter",
                  "Open Sans",
                ]}
              />
            </div>

            {/* Font Size */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Font Size
                </label>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{fontSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={34}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full reader-slider"
              />
            </div>

            {/* Theme */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Theme
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`py-2 px-4 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                    theme === "light"
                      ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-bold"
                      : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Light
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`py-2 px-4 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-bold"
                      : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Layout Mode */}
            <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Layout
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLayoutMode("paginated")}
                  className={`py-2 px-4 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                    layoutMode === "paginated"
                      ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-bold"
                      : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Paginated
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode("scroll")}
                  className={`py-2 px-4 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                    layoutMode === "scroll"
                      ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-bold"
                      : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  Scroll
                </button>
              </div>
            </div>

            {/* Warmth */}
            <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Warmth</label>
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-450">{warmth}%</span>
              </div>

              <input
                type="range"
                min={0}
                max={25}
                value={warmth}
                onChange={(e) => setWarmth(Number(e.target.value))}
                className="w-full reader-slider"
              />
            </div>

            {/* Focus Mode */}
            <div className="flex flex-col gap-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Focus Mode
              </label>
              <button
                type="button"
                onClick={toggleFullscreen}
                className={`w-full py-2 px-4 border text-xs font-semibold uppercase tracking-wider flex items-center justify-center cursor-pointer transition-all rounded-lg ${
                  isFullscreen
                    ? "bg-zinc-950 border-zinc-955 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950 font-bold"
                    : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
