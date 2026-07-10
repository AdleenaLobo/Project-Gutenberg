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
    <div className="mb-10">
      <div className="flex gap-2.5 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 border text-base font-normal tracking-wider rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-100 border-zinc-300 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                  : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
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
