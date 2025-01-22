"use client";

import Image from "next/image";

const Searchbar = () => {
  return (
    <>
      {/* Search input */}
      <div className="h-[5vh]">
        <input
          className="w-[30vw] h-full pl-[1vw] border-blue-600 border-2 rounded-s-lg
           active:border-blue-900 active:outline-none focus:border-blue-900 focus:outline-none"
          type="text"
          placeholder="Search..."
        />
        <button
          type="submit"
          dir="rtl"
          className="w-[6vw] h-full px-[1vw] bg-blue-600 border-blue-600 border-2 rounded-s-lg text-white
          hover:bg-blue-900 hover:border-blue-900 active:bg-blue-950 active:border-blue-950"
        >
          Search
        </button>
      </div>
      {/* filter btn */}
      <button className="h-[4.5vh] mx-[1vw] px-[.4vw] border-blue-600 border-2 rounded
      hover:bg-blue-600 hover:text-white group active:bg-blue-950 active:border-blue-950">
        <Image
          src="/Vector.png"
          alt="filter"
          width={15}
          height={15}
          className="brightness-0 group-hover:invert"
        />
      </button>
    </>
  );
};
export default Searchbar;
