import React from "react";
import { RefreshCw } from "lucide-react";

export function Toolbar({ title, icon, onRefresh }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
      </h2>
      {onRefresh && (
        <button className="icon" onClick={onRefresh} title="Refresh">
          <RefreshCw size={17} />
        </button>
      )}
    </div>
  );
}

export function List({ title, items, body }) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-semibold uppercase">{title}</h3>
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-neutral-600">None yet.</p>
        )}
        {items.map((item) => (
          <p className="border border-neutral-300 p-2 text-sm" key={item.id}>
            {body(item)}
          </p>
        ))}
      </div>
    </div>
  );
}
