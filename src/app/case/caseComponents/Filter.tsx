"use client";

import { useState } from "react";
import Image from "next/image";

const FilterButton: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = ["Option 1", "Option 2", "Option 3", "Option 4"]; // ตัวเลือกกรอง

  // Toggle visibility of the filter dropdown
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  // Handle filter selection
  const handleFilterChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      // Remove filter if already selected
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
    } else {
      // Add filter if not already selected
      setSelectedFilters((prev) => [...prev, filter]);
    }
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        className="h-[5vh] px-[1vw] py-[1vh] border-blue-600 border-4 border-l-0 rounded-r-lg
      hover:bg-blue-600 hover:text-white group active:bg-blue-950 active:border-blue-950"
      onClick={toggleFilterVisibility}
      >
        <Image
          src="/Vector.png"
          alt="filter"
          width={15}
          height={15}
          className="brightness-0 group-hover:invert"
        />
      </button>

      {/* Dropdown */}
      {isFilterVisible && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
          {filters.map((filter) => (
            <label
              key={filter}
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters.includes(filter)}
                onChange={() => handleFilterChange(filter)}
              />
              {filter}
            </label>
          ))}

          {/* Apply Button */}
          <button
            className="block w-full px-4 py-2 text-center bg-blue-500 text-white hover:bg-blue-600 mt-2 rounded"
            onClick={() => {
              console.log("Selected Filters:", selectedFilters); // Debugging
              setIsFilterVisible(false);
            }}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
