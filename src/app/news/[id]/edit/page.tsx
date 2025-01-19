"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../../component/Sidebar";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

const EditNewsPage: FC = () => {
  const router = useRouter();
  const { id } = useParams(); // Access dynamic `id` from the URL
  const [newsData, setNewsData] = useState<any>(null); // Store news data
  const [loading, setLoading] = useState(true); // Track loading state
  const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([0, 0]); // Store coordinates of the marker
  const [showUploadPopup, setShowUploadPopup] = useState(false); // Control visibility of the upload popup
  const imageRef = useRef<HTMLDivElement | null>(null); // Reference to the image container
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the map container

  useEffect(() => {
    if (id) {
      // Mocked fetch based on the `id`
      setLoading(true);
      setTimeout(() => {
        if (id === '1') {
          setNewsData({
            title: "City to Revamp Downtown Sidewalks",
            location: {
              coordinates: [100.5018, 13.7563], // Coordinates for Bangkok, Thailand
              description: "Bangkok, Thailand",
            },
            picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/0088489a5394c8e7cfa4555cdaaf7ba75a89437a.jpg", // Example image URL
            type: "Sidewalks",
            content:
              "The city has announced revised plans to upgrade sidewalks in the downtown area. Work is expected to finish by early next year.",
          });
        } else if (id === '2') {
          setNewsData({
            title: "New Park to Open Downtown",
            location: {
              coordinates: [100.5173, 13.7517], // Different coordinates for another location in Bangkok
              description: "Downtown, Bangkok, Thailand",
            },
            picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/e291c6c03f0ea80511ec553a77b39f874a978fdd.jpg", // Another example image URL
            type: "Park",
            content:
              "A new public park is set to open in the downtown area of Bangkok. It will include walking trails, picnic areas, and play zones for children.",
          });
        } else {
          setNewsData(null); // No data for unrecognized `id`
        }
        setLoading(false);
      }, 1000); // Simulating an API call with a delay
    }
  }, [id]);

  useEffect(() => {
    if (newsData && mapContainerRef.current) {
      if (mapContainerRef.current.clientHeight === 0) {
        return;
      }

      mapboxgl.accessToken = "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";
      
      // Set default map location to Bangkok (Latitude: 13.7563, Longitude: 100.5018)
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [100.5018, 13.7563], // Bangkok coordinates
        zoom: 12,
      });

      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([newsData.location.coordinates[0], newsData.location.coordinates[1]])
        .addTo(map);

      const onDragEnd = () => {
        const lngLat = marker.getLngLat();
        setMarkerCoordinates([lngLat.lng, lngLat.lat]); // Update the coordinates
      };

      marker.on("dragend", onDragEnd);

      return () => {
        map.remove(); // Clean up the map when the component is unmounted
      };
    }
  }, [newsData]);

  const handleCancel = () => {
    alert("Changes canceled");
  };

  const handleSave = () => {
    alert("Changes saved");
  };

  const handleImageClick = () => {
    setShowUploadPopup(true); // Show the upload popup
  };

  const handleUploadClose = () => {
    setShowUploadPopup(false); // Close the upload popup
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!newsData) {
    return <div>No news data available</div>;
  }

  return (
    <>
      <Head>
        <title>Edit News</title>
      </Head>
      <div className="bg-gray-100 flex h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col bg-gray-100 h-full">
          <div className="p-6">
            <div className="flex items-center justify-between w-[87%] mx-auto">
              <div className="text-3xl font-bold">EDIT NEWS</div>
            </div>

            <div className="mt-10 w-[86%] mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 -mr-10 relative" ref={imageRef}>
                  <div className="relative" style={{ width: "70vh", height: "35vh" }}>
                    <Image
                      src={newsData.picture}
                      alt={newsData.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <div
                      className="absolute top-0 left-0 w-full h-full bg-black opacity-40 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300"
                    >
                      <span className="pointer-events-none">Upload New Picture</span>
                    </div>

                    <div
                      onClick={handleImageClick}
                      className="absolute top-0 left-0 w-full h-full cursor-pointer pointer-events-auto"
                    ></div>
                  </div>
                </div>

                <div
                  className="w-[45%] h-[35vh]"
                  ref={mapContainerRef}
                  style={{ height: "35vh" }} // Explicit height for map
                ></div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Title:</label>
                  <input
                    type="text"
                    defaultValue={newsData.title}
                    className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">Location Description:</label>
                  <textarea
                    defaultValue={newsData.location.description}
                    className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={1}
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold">Content:</label>
                  <textarea
                    defaultValue={newsData.content}
                    className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  ></textarea>
                </div>
              </div>

              <div className="relative mt-4 flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#2243C4] text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {showUploadPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div className="text-2xl mb-4">Upload Image</div>
                <input type="file" accept="image/*" className="mb-4" />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleUploadClose}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditNewsPage;
