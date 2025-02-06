"use client";

import { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../component/sidebar";
import "mapbox-gl/dist/mapbox-gl.css";
import dotenv from "dotenv";
import mapboxgl from "mapbox-gl";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import { uploadImage } from "../../component/imageUpload";
const API_BASE_URL = "http://localhost:8080/api"; // Define your API base URL

interface ApiResponse {
  message: {
    token: string[];
  };
}
dotenv.config();
const AddNewsPage: FC = () => {
  const [token, setToken] = useState<string | null>(null); // Define setToken
  const router = useRouter();
  const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([
    0, 0,
  ]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [modal, setModal] = useState<{ status: string; message: string } | null>(null);

  const [countdown, setCountdown] = useState(3);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    location: {
      coordinates: [0, 0], // Default coordinates
      description: "",
    },
    content: "",
    picture: "",
  });

  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    googleMapsApiKey: "AIzaSyCrrohIKFYapXv-xhk9swyHjk6RwT0EpIA",
    libraries: ["places"],
  });

  useEffect(() => {
    if (mapContainerRef.current) {
      // mapboxgl.accessToken = process.env.MAPBOX_TOKEN || "";
      mapboxgl.accessToken =
        "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [100.5171, 13.7367],
        zoom: 12,
      });

      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([100.5171, 13.7367])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setMarkerCoordinates([lngLat.lng, lngLat.lat]);
        setFormData((prev) => ({
          ...prev,
          location: { ...prev.location, coordinates: [lngLat.lng, lngLat.lat] },
        }));
      });

      mapRef.current = map;
      markerRef.current = marker;

      return () => {
        map.remove();
      };
    }
  }, []);

  const handleCancel = () => {
    router.back(); // Navigate to the previous page
  };

  const handleImageClick = () => {
    setShowUploadPopup(true);
  };

  const handleUploadClose = () => {
    setShowUploadPopup(false);
    setImagePreview(null); // Clear the image preview when closing the upload popup
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newCoordinates: [number, number] = [
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ];

        // Update the marker's position
        if (markerRef.current) {
          markerRef.current.setLngLat(newCoordinates);
        }

        // Update state and formData
        setMarkerCoordinates(newCoordinates);
        setFormData((prev) => ({
          ...prev,
          location: {
            coordinates: newCoordinates,
            description: place.formatted_address || "",
          },
        }));

        // Center the map to the new location
        if (mapRef.current) {
          mapRef.current.flyTo({ center: newCoordinates, zoom: 14 });
        }
      }
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setModal({ status: "error", message: "Authentication token is missing" });
      return;
    }

    if (
      !formData.title ||
      !formData.content ||
      !formData.location.description ||
      !formData.picture
    ) {
      setModal({ status: "error", message: "Unable to save due to missing field" });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("location_description", formData.location.description);
      formDataToSend.append("latitude", markerCoordinates[0].toString());
      formDataToSend.append("longitude", markerCoordinates[1].toString());
      formDataToSend.append("type", "news");
      formDataToSend.append("picture", formData.picture);

      const response = await axios.post(`${API_BASE_URL}/News/addNews`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModal({ status: "success", message: "News saved successfully" });
      setTimeout(() => router.push("/news"), 3000);
    } catch (error) {
      const err = error as any;
      console.error("Error:", err.response?.data || err.message);
      setModal({ status: "error", message: "Failed to save news" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));

      try {
        const publicURL = await uploadImage(file);
        setFormData((prev) => ({
          ...prev,
          picture: publicURL,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (modal?.status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setModal(null);
            router.push("/news"); // Redirect to news page
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [modal, setModal, router]);
  

  return (
    <>
      <Head>
        <title>Add News</title>
      </Head>
      <div className="bg-gray-100 flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
          <div className="p-6">
            <div className="flex items-center justify-between w-[87%] mx-auto">
              <div className="text-3xl font-bold">ADD NEWS</div>
            </div>

            <div className="mt-10 w-[86%] mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
  {/* Image Upload Section */}
  <div className="flex-1 relative" ref={imageRef}>
    <div className="relative w-full h-auto aspect-[2/1] md:aspect-[2/1]">
      <img
        src={imagePreview || "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg"}
        alt="Uploaded Preview"
        className="rounded-lg object-cover w-full h-full"
      />
      <div
        onClick={handleImageClick}
        className="absolute top-0 left-0 w-full h-full bg-black opacity-40 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300 cursor-pointer z-10"
      >
        <span className="pointer-events-none">Upload New Picture</span>
      </div>
    </div>
  </div>

  {/* Map Section */}
  <div className="flex-1 h-[35vh] w-full md:h-auto" ref={mapContainerRef}></div>
</div>



              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">
                    Title:
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="p-2 border rounded-lg w-full"
                    placeholder="Title"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">
                    Location Description:
                  </label>
                  {isLoaded && (
                    <Autocomplete
                      onLoad={(auto) => setAutocomplete(auto)}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        name="description"
                        value={formData.location.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              description: e.target.value,
                            },
                          }))
                        }
                        className="p-2 border rounded-lg w-full"
                        placeholder="Enter a Location"
                      />
                    </Autocomplete>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold">
                    Content:
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="p-2 border rounded-lg w-full"
                    placeholder="Content"
                    rows={4}
                  />
                </div>
              </div>

              <div className="relative mt-4 flex justify-end gap-4 z-10">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none z-10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#2243C4] text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none z-10"
                >
                  Save
                </button>
              </div>

              {notification && (
                <div
                  className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 mr-40"
                  style={{ maxWidth: "600px", wordBreak: "break-word" }}
                >
                  <h4 className="font-bold mb-2">{notification.message}</h4>
                  <pre className="text-sm">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                </div>
              )}

              {showUploadPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <div className="text-2xl mb-4">Upload Image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mb-4"
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowUploadPopup(false)}
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
        </div>
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96 text-center">
              <div className="flex flex-col items-center">
                {modal.status === "success" ? (
                  <>
                    <img
                      src="https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"
                      alt="Success Icon"
                      className="w-12 h-12 mb-2"
                    />
                    <h2 className="text-lg font-semibold text-green-600">Success</h2>
                    <p className="text-gray-700 mt-2">
                      Redirecting to news page in <span className="font-bold">{countdown}</span> second{countdown !== 1 ? "s" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/026/526/158/non_2x/error-icon-vector.jpg"
                      alt="Error Icon"
                      className="w-12 h-12 mb-2"
                    />
                    <h2 className="text-lg font-semibold text-red-600">Error</h2>
                    <p className="text-gray-700 mt-2">{modal.message}</p>
                    <button
                      onClick={() => setModal(null)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewsPage;
