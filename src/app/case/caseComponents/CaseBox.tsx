"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import FilterButton from "./Filter";

// // SEARCH
export async function Search(cases: any[], query: string) {
  if (!cases) return [];
  return cases.filter(
    (item) =>
      item.caseId.toString().toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.dateOpened.toLowerCase().includes(query.toLowerCase()) ||
      item.status.toLowerCase().includes(query.toLowerCase())
  );
}

// SHOW CASE
interface ApiResponse {
  message: {
    token: string[];
  };
}

interface CaseData {
  caseId: number;
  category: string;
  detail: string;
  picture: string;
  location: LocationData;
  dateOpened: string;
  dateClosed: string | null;
  status: string;
  damage_value: string;
}

interface LocationData {
  coordinates: [string, string];
  description: string | null;
}

const API_BASE_URL = "http://localhost:8080/api";

const CaseBox: React.FC = () => {
  const [cases, setCases] = useState<CaseData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchCases, setSearchCases] = useState<CaseData[] | null>(null);
  const [query, setQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filters = [
    "Road Damage",
    "Damaged Sidewalk",
    "Overpass Damage",
    "Wire Damage",
  ];

  // Toggle visibility of the filter dropdown
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleFilterChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));
    } else {
      setSelectedFilters((prev) => [...prev, filter]);
    }
  };

  useEffect(() => {
    if (cases) {
      const filteredCases = cases.filter((item) => {
        const matchesQuery = item.detail
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesCategory = selectedFilters.length
          ? selectedFilters.includes(item.category)
          : true;

        return matchesQuery && matchesCategory;
      });

      setSearchCases(filteredCases);
    }
  }, [query, selectedFilters, cases]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchCases = async () => {
      if (!token) return;
      try {
        const response = await axios.get<{ data: CaseData[] }>(
          `${API_BASE_URL}/case/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCases(response.data.data);
        // setSearchCases(response.data.data);
      } catch (err) {
        setError("Failed to fetch cases. Ensure token is valid.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="h-full overflow-y-auto mt-[2vh] pb-[4vh]">
        <div className="w-full flex flex-col justify-center items-center ">
          {/* {cases?.map((item) => ( */}

          {searchCases?.map((item) => (
            <Link
              key={item.caseId}
              href={`/case/${item.caseId}`}
              passHref
              className=""
            >
              <div className="w-full">
                <div
                  key={item.caseId}
                  className="grid grid-cols-6 gap-6 items-center h-[16vh] w-[70vw] mb-[3vh] bg-gray-200 border-white border-4 rounded-xl text-black text-base
                  hover:border-blue-600 hover:bg-white active:border-blue-900"
                >
                  <div className="ml-[3vw] ">
                    <img
                      src={item.picture}
                      alt="case pic"
                      height={120}
                      width={120}
                    />
                  </div>
                  <p className="text-center">{item.caseId}</p>
                  <p className="">{item.category}</p>
                  <p className="">{item.damage_value}</p>
                  <p className="">
                    {new Date(item.dateOpened).toLocaleDateString("en-GB")}
                  </p>
                  <p className="pl-[2vw]">{item.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-[10vh] right-[5vw] flex ">
        {/* Search input */}
        <div className="h-[5vh] flex">
          <img
            src="https://cdn.pixabay.com/photo/2017/01/13/01/22/magnifying-glass-1976105_1280.png"
            alt="search icon"
            className="h-[1.5vw] w-[1.5vw] mt-[1vh] mr-[.5vw]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // onKeyDown={handleKeyDown}
            className="w-[30vw] h-full pl-[1vw] border-blue-600 border-4 rounded-s-lg
           active:border-blue-900 active:outline-none focus:border-blue-900 focus:outline-none"
            type="text"
            placeholder="Search..."
          />
        </div>
        {/* filter btn */}
        <FilterButton
          isFilterVisible={isFilterVisible}
          setIsFilterVisible={setIsFilterVisible}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          filters={filters}
          toggleFilterVisibility={toggleFilterVisibility}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </>
  );
};

export default CaseBox;
