import React,{ useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-sm px-4 py-2 bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none cursor-pointer hover:bg-zinc-55 dark:hover:bg-zinc-800/80 transition-colors"
      >
        <span className="font-semibold">{value}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg z-[999] p-1 flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full text-left text-sm px-4 py-2.5 flex justify-between items-center rounded-md transition-colors cursor-pointer border-none ${
                  isSelected
                    ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 font-bold"
                    : "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check size={14} className="text-white dark:text-zinc-950" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
