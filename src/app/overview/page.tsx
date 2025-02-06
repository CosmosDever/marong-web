"use client";

import { FC, useState, useEffect, useRef, JSX } from "react";
import Head from "next/head";
import Sidebar from "../component/sidebar";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo } from 'react';

interface Location {
  coordinates: [number, number]; // Coordinates are now an array of two numbers
  description: string; // Description of the location (e.g., street name)
}

interface CaseDetails {
  case_id: string;
  category: string;
  location: Location; // Updated to include location details
  status: string;
  date_opened: string;
  date_closed: string;
  picture: string;
  picture_done: string;
}

interface AllCaseData {
  total_all_cases: number;
  waiting_all_cases: number;
  inprogress_all_cases: number;
  done_all_case: number;
  cancel_all_cases: number;
  toMap: CaseDetails[]; // Array of case details
}

interface ApiResponse {
  statusCode: string;
  statusMessage: string;
  data: AllCaseData; // The 'data' field contains AllCaseData
}


interface RoadLocation {
  coordinates: [number, number]; // Coordinates as an array of strings
  description: string; // Description of the location (e.g., street name)
}

interface RoadCaseDetails {
  case_id: string;
  category: string;
  location: RoadLocation; // Updated to include location details
  status: string;
  date_opened: string;
  date_closed: string;
  picture: string;
  picture_done: string;
}

interface RoadAllCaseData {
  total_all_cases: number;
  waiting_all_cases: number;
  inprogress_all_cases: number;
  done_all_case: number;
  cancel_all_cases: number;
  toMap: RoadCaseDetails[]; // Array of case details
}

interface RoadApiResponse {
  statusCode: string;
  statusMessage: string;
  data: RoadAllCaseData; // The 'data' field contains RoadAllCaseData
}


interface WireLocation {
  coordinates: [number, number]; // Coordinates as an array of numbers
  description: string; // Description of the location (e.g., street name)
}

interface WireCaseDetails {
  case_id: string;
  category: string;
  location: WireLocation;
  status: string;
  date_opened: string;
  date_closed: string;
  picture: string;
  picture_done: string;
}

interface WireAllCaseData {
  total_all_cases: number;
  waiting_all_cases: number;
  inprogress_all_cases: number;
  done_all_case: number;
  cancel_all_cases: number;
  toMap: WireCaseDetails[];
}

interface WireApiResponse {
  statusCode: string;
  statusMessage: string;
  data: WireAllCaseData;
}


interface PavementLocation {
  coordinates: [number, number]; // Coordinates as an array of numbers
  description: string; // Description of the location (e.g., street name)
}

interface PavementCaseDetails {
  case_id: string;
  category: string;
  location: PavementLocation;
  status: string;
  date_opened: string;
  date_closed: string;
  picture: string;
  picture_done: string;
}

interface PavementAllCaseData {
  total_all_cases: number;
  waiting_all_cases: number;
  inprogress_all_cases: number;
  done_all_case: number;
  cancel_all_cases: number;
  toMap: PavementCaseDetails[];
}

interface PavementApiResponse {
  statusCode: string;
  statusMessage: string;
  data: PavementAllCaseData;
}



interface OverpassLocation {
  coordinates: [number, number]; // Coordinates as an array of numbers
  description: string; // Description of the location (e.g., street name)
}

interface OverpassCaseDetails {
  case_id: string;
  category: string;
  location: OverpassLocation;
  status: string;
  date_opened: string;
  date_closed: string;
  picture: string;
  picture_done: string;
}

interface OverpassAllCaseData {
  total_all_cases: number;
  waiting_all_cases: number;
  inprogress_all_cases: number;
  done_all_case: number;
  cancel_all_cases: number;
  toMap: OverpassCaseDetails[];
}

interface OverpassApiResponse {
  statusCode: string;
  statusMessage: string;
  data: OverpassAllCaseData;
}


mapboxgl.accessToken = "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw"; // Replace with your Mapbox token

const OverviewPage: FC = (): JSX.Element => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCase, setSelectedCase] = useState("All Case");
  const [caseData, setCaseData] = useState<any>(null);
  const [caseCount, setCaseCount] = useState(0);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ showWaiting: true, showInProgress: true, showDone: true });

  const [mapData, setMapData] = useState<any[]>([]);

  // All Case Data State
  const [allCaseData, setAllCaseData] = useState<AllCaseData | null>(null);
  const [allCaseError, setAllCaseError] = useState<string | null>(null);
  const [allCaseLoading, setAllCaseLoading] = useState<boolean>(true);

  // Road Case Data State
  const [roadData, setRoadData] = useState<RoadAllCaseData | null>(null);
  const [roadMapData, setRoadMapData] = useState<RoadCaseDetails[]>([]);
  const [roadError, setRoadError] = useState<string | null>(null);
  const [roadLoading, setRoadLoading] = useState<boolean>(true);

  // State for Wire Case Data
  const [wireData, setWireData] = useState<WireAllCaseData | null>(null);
  const [wireMapData, setWireMapData] = useState<WireCaseDetails[]>([]);
  const [wireError, setWireError] = useState<string | null>(null);
  const [wireLoading, setWireLoading] = useState<boolean>(true);

  // State for Pavement Case Data
  const [pavementData, setPavementData] = useState<PavementAllCaseData | null>(null);
  const [pavementMapData, setPavementMapData] = useState<PavementCaseDetails[]>([]);
  const [pavementError, setPavementError] = useState<string | null>(null);
  const [pavementLoading, setPavementLoading] = useState<boolean>(true);
  
  // State for Overpass Case Data
  const [overpassData, setOverpassData] = useState<OverpassAllCaseData | null>(null);
  const [overpassMapData, setOverpassMapData] = useState<OverpassCaseDetails[]>([]);
  const [overpassError, setOverpassError] = useState<string | null>(null);
  const [overpassLoading, setOverpassLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllCaseData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setAllCaseError("No token found");
        setAllCaseLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/api/overview/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data: ApiResponse = await response.json();
  
        if (data.statusCode === "200") {
          const formattedAllcase: AllCaseData = {
            total_all_cases: data.data.total_all_cases,
            waiting_all_cases: data.data.waiting_all_cases,
            inprogress_all_cases: data.data.inprogress_all_cases,
            done_all_case: data.data.done_all_case,
            cancel_all_cases: data.data.cancel_all_cases,
            toMap: data.data.toMap.map((caseItem) => ({
              case_id: caseItem.case_id,
              category: caseItem.category,
              location: {
                coordinates: caseItem.location.coordinates, // Hardcoded for testing
                description: caseItem.location.description,
              },
              // status: caseItem.status,
              date_opened:caseItem.date_opened,
              date_closed:caseItem.date_closed,
              picture:caseItem.picture,
              picture_done:caseItem.picture_done,
              status: caseItem.status,
            })),
          };
  
          setAllCaseData(formattedAllcase);
          setMapData(formattedAllcase.toMap); // Set initial data for the map
          updateMap(formattedAllcase.toMap, "All Case"); // Update map with all cases
        } else {
          throw new Error("Failed to load cases");
        }
      } catch (err: any) {
        setAllCaseError(err.message);
      } finally {
        setAllCaseLoading(false);
      }
    };
  
    fetchAllCaseData();
  }, []); // Runs once when the component mounts
  
  
  useEffect(() => {
    const fetchRoadData = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const response = await fetch("http://localhost:8080/api/overview/road", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data: RoadApiResponse = await response.json();
  
        if (data.statusCode === "200") {
          const formattedRoadData: RoadAllCaseData = {
            total_all_cases: data.data.total_all_cases,
            waiting_all_cases: data.data.waiting_all_cases,
            inprogress_all_cases: data.data.inprogress_all_cases,
            done_all_case: data.data.done_all_case,
            cancel_all_cases: data.data.cancel_all_cases,
            toMap: data.data.toMap.map((caseItem) => ({
              case_id: caseItem.case_id,
              category: caseItem.category,
              location: {

                coordinates: caseItem.location.coordinates,
                description: caseItem.location.description,
              },
              // status: caseItem.status,
              date_opened:caseItem.date_opened,
              date_closed:caseItem.date_closed,
              picture:caseItem.picture,
              picture_done:caseItem.picture_done,
              status: caseItem.status,              
            })),
          };
  
          setRoadData(formattedRoadData);
          setMapData(formattedRoadData.toMap); // Set the map data here after fetching
        } else {
          throw new Error("Failed to load road cases");
        }
      } catch (err: any) {
        setRoadError(err.message);
      } finally {
        setRoadLoading(false);
      }
    };
  
    fetchRoadData();
  }, []);



  useEffect(() => {
    const fetchWireData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setWireError("No token found");
        setWireLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/api/overview/wire", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data: WireApiResponse = await response.json();
  
        if (data.statusCode === "200") {
          const formattedWireData: WireAllCaseData = {
            total_all_cases: data.data.total_all_cases,
            waiting_all_cases: data.data.waiting_all_cases,
            inprogress_all_cases: data.data.inprogress_all_cases,
            done_all_case: data.data.done_all_case,
            cancel_all_cases: data.data.cancel_all_cases,
            toMap: data.data.toMap.map((caseItem) => ({
              case_id: caseItem.case_id,
              category: caseItem.category,
              location: {
                coordinates: caseItem.location.coordinates, // Example hardcoded coordinates
                description: caseItem.location.description,
              },
              date_opened:caseItem.date_opened,
              date_closed:caseItem.date_closed,
              picture:caseItem.picture,
              picture_done:caseItem.picture_done,
              status: caseItem.status,
            })),
          };
  
          setWireData(formattedWireData);
          setWireMapData(formattedWireData.toMap); // Update map data for wire cases
        } else {
          throw new Error("Failed to load wire cases");
        }
      } catch (err: any) {
        setWireError(err.message);
      } finally {
        setWireLoading(false);
      }
    };
  
    fetchWireData();
  }, []);



  useEffect(() => {
    const fetchPavementData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setPavementError("No token found");
        setPavementLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/api/overview/pavement", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data: PavementApiResponse = await response.json();
  
        if (data.statusCode === "200") {
          const formattedPavementData: PavementAllCaseData = {
            total_all_cases: data.data.total_all_cases,
            waiting_all_cases: data.data.waiting_all_cases,
            inprogress_all_cases: data.data.inprogress_all_cases,
            done_all_case: data.data.done_all_case,
            cancel_all_cases: data.data.cancel_all_cases,
            toMap: data.data.toMap.map((caseItem) => ({
              case_id: caseItem.case_id,
              category: caseItem.category,
              location: {
                coordinates: caseItem.location.coordinates, // Example hardcoded coordinates
                description: caseItem.location.description,
              },
              // status: caseItem.status,
              date_opened:caseItem.date_opened,
              date_closed:caseItem.date_closed,
              picture:caseItem.picture,
              picture_done:caseItem.picture_done,
              status: caseItem.status,
            })),
          };
  
          setPavementData(formattedPavementData);
          setPavementMapData(formattedPavementData.toMap); // Update map data for wire cases
        } else {
          throw new Error("Failed to load pavement cases");
        }
      } catch (err: any) {
        setPavementError(err.message);
      } finally {
        setPavementLoading(false);
      }
    };
  
    fetchPavementData();
  }, []);



  useEffect(() => {
    const fetchOverpassData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setOverpassError("No token found");
        setOverpassLoading(false);
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8080/api/overview/overpass", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data: OverpassApiResponse = await response.json();
  
        if (data.statusCode === "200") {
          const formattedOverpassData: OverpassAllCaseData = {
            total_all_cases: data.data.total_all_cases,
            waiting_all_cases: data.data.waiting_all_cases,
            inprogress_all_cases: data.data.inprogress_all_cases,
            done_all_case: data.data.done_all_case,
            cancel_all_cases: data.data.cancel_all_cases,
            toMap: data.data.toMap.map((caseItem) => ({
              case_id: caseItem.case_id,
              category: caseItem.category,
              location: {
                coordinates: caseItem.location.coordinates, // Example hardcoded coordinates
                description: caseItem.location.description,
              },
              date_opened:caseItem.date_opened,
              date_closed:caseItem.date_closed,
              picture:caseItem.picture,
              picture_done:caseItem.picture_done,
              status: caseItem.status,
            })),
          };
  
          setOverpassData(formattedOverpassData);
          setOverpassMapData(formattedOverpassData.toMap); // Update map data for wire cases
        } else {
          throw new Error("Failed to load overpass cases");
        }
      } catch (err: any) {
        setOverpassError(err.message);
      } finally {
        setOverpassLoading(false);
      }
    };
  
    fetchOverpassData();
  }, []);
  
  

  
  // useEffect(() => {
  //   if (mapRef.current) {
  //     const caseToUse = selectedCase || "All Case";
  //     updateMap(mapData, caseToUse);
  //   }
  // }, [mapData, selectedCase]); // Combined dependencies


  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [100.5171, 13.7367],
        zoom: 12,
      });
  
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  
      mapRef.current.on("load", () => {
        // Update map once it's loaded and data is available
        if (allCaseData?.toMap) {
          updateMap(allCaseData.toMap, "All Case");
        }
      });
    }
  }, [allCaseData]); // Runs whenever `allCaseData` changes
  



  const updateMap = (mapData: any[], filter: string = "All Case", currentFilters = filters) => {
    if (!mapRef.current) {
      console.error("Map is not initialized.");
      return;
    }
  
    console.log("Updating map with data:", mapData, "Filter:", filter);
  
    const map = mapRef.current;
  
    // Clear existing markers
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  
    // Define category-based markers
    const markerImages: Record<string, string> = {
      "Road Damage|Waiting": "../red road marker.png",
      "Road Damage|InProgress": "../orange road marker.png",
      "Road Damage|Done": "../green road marker.png",
      "Wire Damage|Waiting": "../red wire marker.png",
      "Wire Damage|InProgress": "../orange wire marker.png",
      "Wire Damage|Done": "../green wire marker.png",
      "Damaged Sidewalk|Waiting": "../red pavement marker.png",
      "Damaged Sidewalk|InProgress": "../orange pavement marker.png",
      "Damaged Sidewalk|Done": "../green pavement marker.png",
      "Overpass Damage|Waiting": "../red overpass marker.png",
      "Overpass Damage|InProgress": "../orange overpass marker.png",
      "Overpass Damage|Done": "../green overpass marker.png",
      "Damaged Sidewalk|Cancel": "../red cancel marker.png",
      "Road Damage|Cancel": "../red cancel marker.png",
      "Wire Damage|Cancel": "../red cancel marker.png",
      "Overpass Damage|Cancel": "../red cancel marker.png",
    };
  
    let filteredData = mapData;
  
    if (filter !== "All Case") {
      switch (filter) {
        case "Street":
          filteredData = mapData.filter((item) => item.category === "Road Damage");
          break;
        case "Wire":
          filteredData = mapData.filter((item) => item.category === "Wire Damage");
          break;
        case "Pavement":
          filteredData = mapData.filter((item) => item.category === "Damaged Sidewalk");
          break;
        case "Overpass":
          filteredData = mapData.filter((item) => item.category === "Overpass Damage");
          break;
        default:
          console.warn("Unknown filter category:", filter);
      }
    }
  
    console.log("Filtered Data:", filteredData);
    console.log("Filtered by status:", currentFilters, filteredData);
  
    // Add markers for filtered data
    filteredData.forEach((item) => {
      if (!item.location.coordinates || item.location.coordinates.length !== 2) {
        console.warn("Invalid coordinates for marker:", item);
        return;
      }
       // If status is "Cancel", always use the red cancel marker

  
      const markerKey = `${item.category}|${item.status}`;
      const markerImage = markerImages[markerKey] || "/images/default-marker.png"; // Fallback marker

      
  
      // Create custom marker element
      const markerElement = document.createElement("img");
      markerElement.src = markerImage;
      if (markerImage === "../red cancel marker.png") {
        markerElement.style.width = "28px";
        markerElement.style.height = "35px";
      } else {
        markerElement.style.width = "32px";
        markerElement.style.height = "45px";
      }
      markerElement.style.cursor = "pointer";
  
      new mapboxgl.Marker({ element: markerElement })
        .setLngLat([parseFloat(item.location.coordinates[1]), parseFloat(item.location.coordinates[0])]) // Ensure correct lat/lon order
        .addTo(map)
        .getElement()
        .addEventListener("click", () => {
          setSelectedCaseDetails(item); // Show details when marker is clicked
          setIsModalOpen(true); // Open the modal
        });
    });
  };
  


  
  
  const handleFilterChange = (filterType: keyof typeof filters, isChecked: boolean) => {
    // Prevent excessive re-rendering
    if (filters[filterType] === isChecked) return;
  
    // Update state
    const updatedFilters = { ...filters, [filterType]: isChecked };
    setFilters(updatedFilters);
  
    // Refresh map with updated filters
    updateMap(mapData, selectedCase, updatedFilters); // Pass updated filters directly
  };
  

  
  

  

  
  

  const handleCaseChange = (caseType: string) => {
    setSelectedCase(caseType);
  
    if (caseType === "Street" && roadData) {
      console.log("Street data:", roadData.toMap); // Check if the correct data is being passed
      setMapData(roadData.toMap);
      updateMap(roadData.toMap);  // Ensure the map is updated immediately with new data
    } else if (caseType === "All Case" && allCaseData) {
      console.log("All case data:", allCaseData.toMap); // Check if the correct data is being passed
      setMapData(allCaseData.toMap);
      updateMap(allCaseData.toMap);
    }else if (caseType === "Wire" && allCaseData) {
      if (wireData) {
        console.log("Wire data:", wireData.toMap); // Check if the correct data is being passed
        setMapData(wireData.toMap);
        updateMap(wireData.toMap);
      }
    }else if (caseType === "Pavement" && allCaseData) {
      if (pavementData) {
        console.log("Pavement data:", pavementData.toMap); // Check if the correct data is being passed
        setMapData(pavementData.toMap);
        updateMap(pavementData.toMap);
      }
    }else if (caseType === "Overpass" && allCaseData) {
      if (overpassData) {
        console.log("Overpass data:", overpassData.toMap); // Check if the correct data is being passed
        setMapData(overpassData.toMap);
        updateMap(overpassData.toMap);
      }
    }
  };
  

  useEffect(() => {
    // Update the map whenever the filters change
    if (mapRef.current) {
      updateMap(mapData, selectedCase);  // You can pass `selectedCase` to keep the filter context consistent
    }
  }, [filters]);  // Dependency on filters to trigger a map update when filters change
  

  

  
  // useEffect(() => {
  //   if (mapRef.current) {
  //     // Apply the filter when map data or filters change
  //     const filteredMapData = mapData.filter((caseItem) => {
  //       if (filters.showWaiting && caseItem.status === "Waiting") {
  //         return true;
  //       }
  //       if (filters.showInProgress && caseItem.status === "In Progress") {
  //         return true;
  //       }
  //       if (filters.showDone && caseItem.status === "Done") {
  //         return true;
  //       }
  //       return false;
  //     });
  
  //     // Update the map with the filtered data
  //     updateMap(filteredMapData);
  //   }
  // }, [mapData, filters]); // Runs when mapData or filters change


  return (
    <>
      <Head>
        <title>Overview Page</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <div className="bg-gray-100 flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-100 h-full overflow-hidden">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between w-[87%] mx-auto">
              <div className="text-3xl font-bold">OVERVIEW</div>
                <div className="p-2 bg-white shadow-lg rounded-2xl border border-gray-200 p-[-1vh]">
                  <div className="flex items-center">
                    <span className="text-black font-semibold text-2xl ">{selectedCase}</span>
                    <div className="ml-3 w-20 h-[9vh] bg-[#E8EBF5] flex items-center justify-center rounded-2xl shadow-md border border-gray-300">
                      <span className="text-gray-800 font-bold text-3xl">
                        {selectedCase === 'All Case' ? allCaseData?.total_all_cases :
                        selectedCase === 'Street' ? roadData?.total_all_cases :
                        selectedCase === 'Pavement' ? pavementData?.total_all_cases :
                        selectedCase === 'Overpass' ? overpassData?.total_all_cases :
                        selectedCase === 'Wire' ? wireData?.total_all_cases : 0}
                      </span>
                    </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 relative border border-gray-300 rounded-xl shadow-md px-1 py-2 bg-white h-[10vh] w-[120vh] ml-[30vh] z-[1]">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="divide-x divide-gray-400"> 
                    {["All Case", "Street", "Wire", "Pavement", "Overpass"].map((caseType) => (
                      <th
                        key={caseType}
                        className={`p-2 text-center text-black font-medium cursor-pointer text-2xl transition-transform duration-500 ${
                          selectedCase === caseType
                            ? "scale-105 font-bold underline decoration-[4px] decoration-[#1B369C]"
                            : "hover:scale-105"
                        }`}
                        onClick={() => handleCaseChange(caseType)}
                      >
                        {caseType}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>





            <div className="p-4 bg-[#DEE3F6] flex-1 w-[calc(100%+3.0rem)] -mx-6 -mt-4 -mb-6 z-[2]">
              <div className="flex justify-center items-center w-full h-12 ml-5">

                <div className="flex flex-col items-center w-[30%] border-r-2 border-gray-300 -mt-3 relative">
                  <div className="flex items-center">
                    <img 
                      src="../waiting icon.png" 
                      alt="Waiting Icon" 
                      className="w-[7vh] h-[7vh] absolute left-[14vh] top-[0vh]" 
                    />
                    <span className="text-lg font-semibold ml-[0vh]">Waiting</span>
                  </div>
                  <span className="text-base text-gray-700">{allCaseData?.waiting_all_cases}</span>
                </div>


                <div className="flex flex-col items-center w-[30%] border-r-2 border-gray-300 -mt-3 relative">
                  <div className="flex items-center">
                    <img 
                      src="../in progress icon.png" 
                      alt="in progress Icon" 
                      className="w-[7vh] h-[7vh] absolute left-[13vh] top-[0vh]" 
                    />
                    <span className="text-lg font-semibold">In Progress</span>
                  </div>
                  <span className="text-base text-gray-700">{allCaseData?.inprogress_all_cases}</span>
                </div>
                
                <div className="flex flex-col items-center w-[30%] -mt-3 relative">
                  <div className="flex items-center">
                      <img 
                        src="../done icon.png" 
                        alt="done Icon" 
                        className="w-[7vh] h-[7vh] absolute left-[16vh] top-[0vh]" 
                      />
                    <span className="text-lg font-semibold">Done</span>
                  </div>
                  <span className="text-base text-gray-700">{allCaseData?.done_all_case}</span>
                </div>
                {/* <div className="flex flex-col items-center w-[30%] border-r-2 border-gray-300">
                  <span className="text-xl font-semibold">In Progress</span>
                  <span className="text-lg text-gray-700">{caseData?.inprogress}</span>
                </div>
                <div className="flex flex-col items-center w-[30%]">
                  <span className="text-xl font-semibold">Done</span>
                  <span className="text-lg text-gray-700">{caseData?.done}</span>
                </div> */}
              </div>
              <div ref={mapContainerRef} className="w-full h-full rounded-xl h-[89.9%] mb-[-50vh]" />
            </div>
          </div>
        </div>
      </div>
      
{/* Modal to display case details */}
{isModalOpen && selectedCaseDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overlay">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] modal-content flex flex-col">
      <h3 className="text-lg font-semibold text-center">{selectedCaseDetails.category}</h3>

      {/* Left-aligned details */}
      <div className="mt-4">
        <p><strong>Location:</strong> {selectedCaseDetails.location.description}</p>
        <p><strong>Details:</strong> {selectedCaseDetails.detail}</p>
        <p><strong>Status:</strong> {selectedCaseDetails.status}</p>
        <p><strong>Opened On:</strong> {selectedCaseDetails?.date_opened ? new Date(selectedCaseDetails.date_opened).toLocaleDateString() : "N/A"}</p>
        <p><strong>Closed On:</strong> {selectedCaseDetails?.date_closed ? new Date(selectedCaseDetails.date_closed).toLocaleDateString() : "N/A"}</p>
      </div>

      {/* Image layout logic */}
      <div className="mt-4 w-full flex flex-col items-center">
        {selectedCaseDetails.picture && selectedCaseDetails.picture_done ? (
          <>
            <div
              className={`${
                selectedCaseDetails.imageSize < 200 // Replace with proper size logic
                  ? "flex flex-row space-x-4 justify-between w-full"
                  : "flex flex-col items-center"
              }`}
            >
              {/* Before Image */}
              <div className="flex flex-col items-center">
                <img
                  src={selectedCaseDetails.picture}
                  alt="Before Case Image"
                  className="max-w-full max-h-[180px] object-contain"
                />
                <p className="text-sm text-gray-600 mt-1">Before</p>
              </div>

              {/* After Image */}
              <div className="flex flex-col items-center mt-4">
                <img
                  src={selectedCaseDetails.picture_done}
                  alt="After Case Image"
                  className="max-w-full max-h-[180px] object-contain"
                />
                <p className="text-sm text-gray-600 mt-1">After</p>
              </div>
            </div>
          </>
        ) : (
          /* Single Image Centered */
          <div className="flex flex-col items-center">
            <img
              src={selectedCaseDetails.picture}
              alt="Case Image"
              className="max-w-full max-h-[400px] object-contain"
            />
            <p className="text-sm text-gray-600 mt-1">Before</p>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded self-center"
        onClick={() => setIsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}



    </>
  );
};

export default OverviewPage;
