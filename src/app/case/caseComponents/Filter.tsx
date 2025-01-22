"use client";

import { useState } from "react";
import Image from "next/image";

interface Filter {
  isFilterVisible:boolean;
  setIsFilterVisible:React.Dispatch<React.SetStateAction<boolean>>;
  selectedFilters:string[];
  setSelectedFilters:React.Dispatch<React.SetStateAction<string[]>>;
  filters:string[];
  toggleFilterVisibility: () => void;
  handleFilterChange: (filter: string) => void;
}

const FilterButton: React.FC<Filter> = ({
  isFilterVisible,
  setIsFilterVisible,
  selectedFilters,
  setSelectedFilters,
  filters,
  toggleFilterVisibility,
  handleFilterChange,
}) => {
  

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
        <div className="absolute right-[.2vw] mt-[1vh] w-[10vw] bg-white border border-gray-300 rounded shadow-lg">
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
            className="block w-full px-[1vw] py-[1vh] text-center bg-blue-600 text-white hover:bg-blue-800 active:bg-blue-950 mt-[1vh] rounded"
            onClick={() => {
              console.log("Selected Filters:", selectedFilters); 
              setIsFilterVisible(false);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
