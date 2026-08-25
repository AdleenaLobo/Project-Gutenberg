import React from "react";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#FCFBFA] dark:bg-zinc-950 py-12 px-6">
      <div className="max-w-2xl mx-auto border border-[#E9E1D2] dark:border-zinc-800 bg-[#FDFBF9] dark:bg-zinc-900 p-8 sm:p-10 rounded-2xl shadow-md">
        
        {/* Header section with book icon */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#FAF2F2] dark:bg-zinc-800 border border-[#EAD8D8] dark:border-zinc-700 flex items-center justify-center shadow-inner">
            <BookOpen size={28} className="text-[#851C1C] dark:text-[#a82c2c]" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-white">Bibliotheke</h1>
            <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
              A Premium Reading Experience
            </p>
          </div>
        </div>

        {/* Content section */}
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-[14px]">
          <p>
            Welcome to <strong>Bibliotheke</strong>, your personal portal to classic literature. 
            This catalog system is tailored to give you elegant, comfortable access to thousands 
            of public domain ebooks sourced from the <em>Project Gutenberg</em> archives.
          </p>

          <div className="border-t border-[#F2ECE0] dark:border-zinc-800 pt-6">
            <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white mb-4">Key Capabilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF7F2] dark:bg-zinc-950/40 border border-[#EFEAE2] dark:border-zinc-800/80 rounded-xl">
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Tailored Reader</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Custom themes, warm night shading, font sizes, margins, and line heights.</p>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-zinc-950/40 border border-[#EFEAE2] dark:border-zinc-800/80 rounded-xl">
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Reading Rooms</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Read collaboratively, sync your page positions, and share annotations.</p>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-zinc-950/40 border border-[#EFEAE2] dark:border-zinc-800/80 rounded-xl">
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Personal Library</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Save bookmarked pages, manage favorites, and search by authors, titles, or genres.</p>
              </div>
              <div className="p-4 bg-[#FAF7F2] dark:bg-zinc-950/40 border border-[#EFEAE2] dark:border-zinc-800/80 rounded-xl">
                <h4 className="font-semibold text-zinc-900 dark:text-white mb-1">Offline Resilience</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Optimized parsing and smart offline caching for uninterrupted reading.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F2ECE0] dark:border-zinc-800 pt-8 flex justify-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#851C1C] hover:bg-[#6c1616] text-white text-xs uppercase tracking-wider font-semibold rounded-full transition-colors duration-200 cursor-pointer shadow-sm focus:outline-none border-none"
            >
              <ArrowLeft size={14} />
              <span>Back to Library</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
