"use client";

import { FC, useState, useEffect, useRef, JSX } from "react";
import Head from "next/head";
import Sidebar from "../component/Sidebar";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


mapboxgl.accessToken = "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw"; // Replace with your Mapbox token

const OverviewPage: FC = (): JSX.Element => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedCase, setSelectedCase] = useState("All Case");
  const [caseData, setCaseData] = useState<any>(null);
  const [mapData, setMapData] = useState<any[]>([]);
  const [caseCount, setCaseCount] = useState(0);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ showWaiting: true, showInProgress: true, showDone: true });

  type CaseType = "All Case" | "Street" | "Wire" | "Pavement" | "Overpass";

  const allData: Record<CaseType, { total: number; waiting: number; inprogress: number; done: number; to_map: { case_id: string; category: string; location: { coordinates: number[]; description: string; }; status: string; }[]; }> = {
    "All Case": {
      total: 150,
      waiting: 80,
      inprogress: 40,
      done: 30,
      to_map: [
        { case_id: "301", category: "Street", location: { coordinates: [100.4171, 13.7367], description: "Bangkok" }, status: "Waiting" },
        { case_id: "401", category: "Wire", location: { coordinates: [100.5171, 13.7367], description: "Bangkok" }, status: "Done" },
        { case_id: "501", category: "Pavement", location: { coordinates: [100.6171, 13.7367], description: "Bangkok" }, status: "In Progress" },
        { case_id: "601", category: "Overpass", location: { coordinates: [100.7171, 13.7367], description: "Bangkok" }, status: "Waiting" },
      ],
    },
    "Street": {
      total: 1,
      waiting: 2,
      inprogress: 3,
      done: 4,
      to_map: [
        { case_id: "301", category: "Street", location: { coordinates: [100.4171, 13.7367], description: "Bangkok" }, status: "Waiting" },
      ],
    },
    "Wire": { 
      total: 5,
      waiting: 6,
      inprogress: 7,
      done: 8,
      to_map: [
        { case_id: "401", category: "Wire", location: { coordinates: [100.5171, 13.7367], description: "Bangkok" }, status: "Done" },
      ],
    },
    "Pavement": { 
      total: 9,
      waiting: 10,
      inprogress: 11,
      done: 12,
      to_map: [
        { case_id: "501", category: "Pavement", location: { coordinates: [100.6171, 13.7367], description: "Bangkok" }, status: "In Progress" },
      ],
    },
    "Overpass": { 
      total: 13,
      waiting: 14,
      inprogress: 15,
      done: 16,
      to_map: [
        { case_id: "601", category: "Overpass", location: { coordinates: [100.7171, 13.7367], description: "Bangkok" }, status: "Waiting" },
      ],
    },
  };

  type CaseDetail = {
    case_id: string;
    category: string;
    location: {
      coordinates: number[];
      description: string;
    };
    detail: string;
    date_opened: Date;
    date_closed: Date | null;
    picture: string;
    picture_done: string;
    status: string;
  };
  
  type DatabyidType = {
    [key: string]: {
      to_map: CaseDetail[];
    };
  };
  
  const Databyid: DatabyidType = {
    "All Case": {
      to_map: [
        {
          case_id: "401",
          category: "Wire",
          location: { coordinates: [100.5171, 13.7367], description: "Bangkok" },
          detail: "Wire on main road causing traffic issues.",
          status: "Done",
          date_opened: new Date("2024-11-19T08:00:00Z"),
          date_closed: new Date("2024-12-19T08:00:00Z"),
          picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/d4e8937d9eed5c598b4ac8b2fc11df2b8da22069.jpg",
          picture_done: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/13267007216cfcf5ee08f54c5481a2829cea0552.jpg",
        },
      ],
    },
    Street: {
      to_map: [
        {
          case_id: "301",
          category: "Street",
          location: { coordinates: [100.4171, 13.7367], description: "Bangkok" },
          detail: "Damaged street requiring urgent repair.",
          status: "Waiting",
          date_opened: new Date("2024-12-19T08:00:00Z"),
          date_closed: null,
          picture: "newsimage.png",
          picture_done: "",
        },
      ],
    },
    // Add other cases
  };

  useEffect(() => {
    // Initialize map
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [100.5171, 13.7367],
        zoom: 12,
      });
  
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  
      mapRef.current.on("load", () => {
        handleCaseChange("All Case"); // Load all cases initially
      });
    }
  }, []);
  
  useEffect(() => {
    // Update markers whenever filters or mapData change
    updateMap(mapData);
  }, [mapData, filters]); // Depend on mapData and filters
  
  const updateMap = (mapData: any[]) => {
    if (!mapRef.current) {
      console.error("Map is not initialized.");
      return;
    }
  
    const map = mapRef.current;
  
    // Clear existing markers
    document.querySelectorAll(".mapboxgl-marker").forEach((marker) => marker.remove());
  
    const categoryColors: Record<string, string> = {
      Street: "purple",
      Wire: "blue",
      Pavement: "green",
      Overpass: "yellow",
    };
  
    // Add markers based on filters
    mapData.forEach((item) => {
      if (!item.location.coordinates || item.location.coordinates.length !== 2) {
        console.warn("Invalid coordinates for marker:", item);
        return;
      }
  
      // **Correct filter logic**
      const isWaitingVisible = item.status === "Waiting" && filters.showWaiting;
      const isInProgressVisible = item.status === "In Progress" && filters.showInProgress;
      const isDoneVisible = item.status === "Done" && filters.showDone;
  
      // Only add the marker if it's visible based on the filters
      if (!(isWaitingVisible || isInProgressVisible || isDoneVisible)) {
        return;
      }
  
      const markerColor = categoryColors[item.category] || "red";
  
      const marker = document.createElement("div");
      marker.className = "marker";
      marker.style.width = "20px";
      marker.style.height = "20px";
      marker.style.backgroundColor = markerColor;
      marker.style.borderRadius = "50%";
      marker.style.cursor = "pointer";
  
      new mapboxgl.Marker(marker)
        .setLngLat(item.location.coordinates)
        .addTo(map)
        .getElement()
        .addEventListener("click", () => {
          console.log("Marker clicked:", item);
          const caseId = item.case_id;
  
          const caseDetails = Object.values(Databyid)
            .flatMap((category) => category.to_map)
            .find((caseItem) => caseItem.case_id === caseId);
  
          if (caseDetails) {
            setSelectedCaseDetails({ ...caseDetails });
            setIsModalOpen(true);
          } else {
            console.warn("No case details found for case_id:", caseId);
          }
        });
    });
  };
  
  

  const handleCaseChange = (caseType: CaseType) => {
    setSelectedCase(caseType);
    const data = allData[caseType];
    setCaseData(data);
    setMapData(data.to_map);
    updateMap(data.to_map);
  };

  const handleFilterChange = (filterName: string, value: boolean) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterName]: value };
      updateMap(mapData); // Ensure the map updates immediately with the new filters
      return updatedFilters;
    });
  };



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
              <div className="flex items-center">
                <span className="text-black font-semibold text-lg">{selectedCase}</span>
                <div className="ml-3 w-20 h-20 bg-[#E8EBF5] flex items-center justify-center rounded-2xl">
                  <span className="text-gray-800 font-bold text-3xl">{caseData?.total}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-2 relative">
              <table className="w-3/5">
                <thead>
                  <tr>
                    {["All Case", "Street", "Wire", "Pavement", "Overpass"].map((caseType) => (
                      <th
                        key={caseType}
                        className={`p-4 text-left text-black font-medium cursor-pointer ${selectedCase === caseType ? "underline decoration-[4px] decoration-[#1B369C]" : ""}`}
                        onClick={() => handleCaseChange(caseType as CaseType)}
                      >
                        {caseType}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
            <div className="p-4 bg-[#DEE3F6] flex-1 w-[calc(100%+3.0rem)] -mx-6 -mt-4 -mb-6 rounded-2xl">
              <div className="flex justify-between items-center w-full h-20">
                <div className="flex flex-col items-center w-[30%] border-r-2 border-gray-300 -mt-3">
                  <span className="text-xl font-semibold">Waiting</span>
                  <span className="text-lg text-gray-700">{caseData?.waiting}</span>
                  <label className="flex items-center mt-0">
                    <input
                      type="checkbox"
                      checked={filters.showWaiting}
                      onChange={(e) => handleFilterChange("showWaiting", e.target.checked)}
                      className="mr-2"
                    />
                    Show Waiting
                  </label>
                </div>
                <div className="flex flex-col items-center w-[30%] border-r-2 border-gray-300 -mt-3">
                  <span className="text-xl font-semibold">In Progress</span>
                  <span className="text-lg text-gray-700">{caseData?.inprogress}</span>
                  <label className="flex items-center mt-0">
                    <input
                      type="checkbox"
                      checked={filters.showInProgress}
                      onChange={(e) => handleFilterChange("showInProgress", e.target.checked)}
                      className="mr-2"
                    />
                    Show In Progress
                  </label>
                </div>
                <div className="flex flex-col items-center w-[30%] -mt-3">
                  <span className="text-xl font-semibold">Done</span>
                  <span className="text-lg text-gray-700">{caseData?.done}</span>
                  <label className="flex items-center mt-0">
                    <input
                      type="checkbox"
                      checked={filters.showDone}
                      onChange={(e) => handleFilterChange("showDone", e.target.checked)}
                      className="mr-2"
                    />
                    Show Done
                  </label>
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
              <div ref={mapContainerRef} className="w-full h-full rounded-xl h-[88%]" />
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
        <p><strong>Opened On:</strong> {selectedCaseDetails.date_opened.toLocaleDateString()}</p>
        <p><strong>Closed On:</strong> {selectedCaseDetails.date_closed ? selectedCaseDetails.date_closed.toLocaleDateString() : "N/A"}</p>
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
