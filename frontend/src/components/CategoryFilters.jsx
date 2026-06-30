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
  const dynamicCategories = ebooks.map((b) => b.category).filter(Boolean);
  const categories = [...new Set([...presetCategories, ...dynamicCategories])];

  return (
    <div
      className="categories-container"
      style={{
        marginBottom: "24px",
        borderBottom: "1px solid #000",
        paddingBottom: "16px",
      }}
    >
      <p
        className="section-sublabel"
        style={{
          fontSize: "11px",
          letterSpacing: "1px",
          fontWeight: "700",
          color: "#000",
          marginBottom: "12px",
          textTransform: "uppercase",
        }}
      >
        Filter by Category
      </p>
      <div
        className="categories-chips"
        style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
      >
        {categories.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "0px",
                border: "1px solid #000",
                background: isSelected ? "#000" : "#fff",
                color: isSelected ? "#fff" : "#000",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: isSelected ? "600" : "400",
                transition: "all 0.15s ease",
                textTransform: "capitalize",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
