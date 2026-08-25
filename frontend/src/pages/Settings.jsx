import React from "react";
import { ArrowLeft, Moon, Sun, Type, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReaderTheme } from "../context/ReaderThemeContext";

export function Settings() {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    layoutMode,
    setLayoutMode,
  } = useReaderTheme();

  return (
    <div className="min-h-full bg-[#FCFBFA] dark:bg-zinc-955 py-12 px-6">
      <div className="max-w-2xl mx-auto border border-[#E9E1D2] dark:border-zinc-800 bg-[#FDFBF9] dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl shadow-md">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#F2ECE0] dark:border-zinc-800">
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-white flex-grow">
            Preferences & Settings
          </h1>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E9E1D2] dark:border-zinc-700 hover:bg-[#FAF6F0] dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer focus:outline-none bg-transparent"
          >
            <ArrowLeft size={13} />
            <span>Library</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Section: Application Theme */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <Sun size={14} className="text-[#851C1C] dark:text-[#a82c2c]" />
              <span>Appearance</span>
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 py-3 px-4 border rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 focus:outline-none ${
                  theme === "light"
                    ? "bg-[#851C1C] border-[#851C1C] text-white shadow-sm"
                    : "bg-white dark:bg-zinc-950 border-[#E9E1D2] dark:border-zinc-800 text-[#851C1C] dark:text-[#a82c2c] hover:bg-[#FAF6F0] dark:hover:bg-zinc-900"
                }`}
              >
                <Sun size={16} />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 py-3 px-4 border rounded-xl font-semibold text-sm cursor-pointer transition-all flex items-center justify-center gap-2 focus:outline-none ${
                  theme === "dark"
                    ? "bg-[#851C1C] border-[#851C1C] text-white shadow-sm"
                    : "bg-white dark:bg-zinc-950 border-[#E9E1D2] dark:border-zinc-800 text-[#851C1C] dark:text-[#a82c2c] hover:bg-[#FAF6F0] dark:hover:bg-zinc-900"
                }`}
              >
                <Moon size={16} />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Section: Typography */}
          <div className="flex flex-col gap-4 border-t border-[#F2ECE0] dark:border-zinc-800 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <Type size={14} className="text-[#851C1C] dark:text-[#a82c2c]" />
              <span>Typography Settings</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Font Family
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {["Georgia", "Inter", "Literata", "Merriweather", "Open Sans"].map((font) => (
                    <button
                      key={font}
                      onClick={() => setFontFamily(font)}
                      style={{ fontFamily: font }}
                      className={`py-2.5 px-2 border rounded-xl text-xs font-medium cursor-pointer transition-all focus:outline-none ${
                        fontFamily === font
                          ? "bg-[#851C1C] border-[#851C1C] text-white shadow-sm"
                          : "bg-[#FAF8F5] dark:bg-zinc-950 border-[#E7DFD3] dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-[#F2ECE0] dark:hover:bg-zinc-900"
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Font Size
                  </label>
                  <span className="text-xs font-mono font-bold text-[#851C1C] dark:text-[#a82c2c]">{fontSize}px</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setFontSize((v) => Math.max(14, v - 2))}
                    className="w-10 h-10 border border-[#E7DFD3] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-950 rounded-xl flex items-center justify-center font-bold text-lg text-[#851C1C] dark:text-[#a82c2c] hover:bg-[#F2ECE0] dark:hover:bg-zinc-900 cursor-pointer focus:outline-none"
                  >
                    A-
                  </button>
                  <input
                    type="range"
                    min="14"
                    max="34"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="flex-1 accent-[#851C1C] h-1.5 bg-[#FAF8F5] dark:bg-zinc-950 rounded-lg appearance-none cursor-pointer border border-[#E7DFD3] dark:border-zinc-800"
                  />
                  <button 
                    onClick={() => setFontSize((v) => Math.min(34, v + 2))}
                    className="w-10 h-10 border border-[#E7DFD3] dark:border-zinc-800 bg-[#FAF8F5] dark:bg-zinc-950 rounded-xl flex items-center justify-center font-bold text-lg text-[#851C1C] dark:text-[#a82c2c] hover:bg-[#F2ECE0] dark:hover:bg-zinc-900 cursor-pointer focus:outline-none"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Reader Controls */}
          <div className="flex flex-col gap-4 border-t border-[#F2ECE0] dark:border-zinc-800 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              <Sliders size={14} className="text-[#851C1C] dark:text-[#a82c2c]" />
              <span>Reader Layout</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Line Spacing
                </label>
                <div className="flex gap-2">
                  {[1.4, 1.6, 1.8, 2.0].map((height) => (
                    <button
                      key={height}
                      onClick={() => setLineHeight(height)}
                      className={`flex-1 py-2.5 px-2 border rounded-xl text-xs font-medium cursor-pointer transition-all focus:outline-none ${
                        lineHeight === height
                          ? "bg-[#851C1C] border-[#851C1C] text-white shadow-sm"
                          : "bg-[#FAF8F5] dark:bg-zinc-950 border-[#E7DFD3] dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-[#F2ECE0] dark:hover:bg-zinc-900"
                      }`}
                    >
                      {height.toFixed(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                  Layout Mode
                </label>
                <div className="flex gap-2">
                  {["paginated", "scroll"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setLayoutMode(mode)}
                      className={`flex-1 py-2.5 px-2 border rounded-xl text-xs font-medium capitalize cursor-pointer transition-all focus:outline-none ${
                        layoutMode === mode
                          ? "bg-[#851C1C] border-[#851C1C] text-white shadow-sm"
                          : "bg-[#FAF8F5] dark:bg-zinc-950 border-[#E7DFD3] dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-[#F2ECE0] dark:hover:bg-zinc-900"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
