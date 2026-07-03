import React from "react";
import { RefreshCw } from "lucide-react";

export function Toolbar({ title, icon, onRefresh }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
        {icon}
        {title}
      </h2>
      {onRefresh && (
        <button 
          className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all focus:outline-none" 
          onClick={onRefresh} 
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>
      )}
    </div>
  );
}

export function List({ title, items, body }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="text-xs text-zinc-550 dark:text-zinc-500 italic">None yet.</p>
        ) : (
          items.map((item) => (
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-xs text-zinc-800 dark:text-zinc-300 rounded shadow-sm" key={item.id}>
              {body(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
