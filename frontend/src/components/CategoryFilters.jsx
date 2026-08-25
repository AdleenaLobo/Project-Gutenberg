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
      <div className="flex gap-6 flex-wrap">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`h-8 px-1.5 text-sm font-medium cursor-pointer transition-all flex items-center duration-200 focus:outline-none bg-transparent border-t-2 rounded-none ${
                isSelected
                  ? "border-[#851C1C] text-[#851C1C]"
                  : "border-transparent text-[#851C1C]/70 hover:text-[#851C1C]"
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
