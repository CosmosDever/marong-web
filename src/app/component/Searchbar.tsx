"use client";

import Image from "next/image";

const Searchbar = () => {
  return (
    <>
      {/* Search input */}
      <div className="h-[5vh]">
        <input
          className="w-[30vw] h-full pl-[1vw] border-blue-600 border-2 rounded-s-lg"
          type="text"
          placeholder="Search..."
        />
        <button
          type="submit"
          dir="rtl"
          className="w-[6vw] h-full px-[1vw] bg-blue-600 border-blue-600 border-2 rounded-s-lg text-white"
        >
          Search
        </button>
      </div>
      {/* filter btn */}
      <button className="h-[4.5vh] mx-[1vw] px-[.4vw] border-blue-600 border-2 rounded">
        <Image
          src="/Vector.png"
          alt="filter"
          width={15}
          height={15}
        />
      </button>
    </>
  );
};
export default Searchbar;
