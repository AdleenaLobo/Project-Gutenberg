import React from "react";

export function CategoryFilters({
  selectedCategory,
  onSelectCategory,
  ebooks,
}) {
  // Preset monochrome categories
  const presetCategories = [
    "All",
    "Fiction",
    "Non-Fiction",
    "Sci-Fi",
    "Tech",
    "Mystery",
  ];
  const dynamicCategories = ebooks.map((b) => b.ebook?.category || b.category).filter(Boolean);
  const categories = [...new Set([...presetCategories, ...dynamicCategories])];

  return (
    <div className="border-b-2 border-zinc-300 dark:border-zinc-700 pb-6 mb-6">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-450 mb-3 block">
        Filter by Category
      </p>
      <div className="flex gap-2.5 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 border-2 text-xs font-bold transition-all uppercase tracking-wider rounded-none cursor-pointer ${
                isSelected
                  ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-950"
                  : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-white hover:shadow-[2px_2px_0px_#000] dark:hover:shadow-[2px_2px_0px_#fff]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
