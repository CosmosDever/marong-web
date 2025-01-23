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
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = process.env.MAPBOX_TOKEN || "";

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
    setTitle("");
    setDescription("");
    setContent("");
    setMarkerCoordinates([0, 0]);
    setImagePreview(null); // Clear the image preview when canceling
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
      setNotification({
        status: "error",
        message: "Authentication token is missing",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append(
        "location_description",
        formData.location.description
      );
      formDataToSend.append("latitude", markerCoordinates[0].toString());
      formDataToSend.append("longitude", markerCoordinates[1].toString());
      formDataToSend.append("type", "news");
      formDataToSend.append("picture", formData.picture); // Assuming picture URL is in the state

      const response = await axios.post(
        `${API_BASE_URL}/News/addNews`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification({
        status: "success",
        message: "News saved successfully",
      });
      setTimeout(() => router.push("/news"), 3000);
    } catch (error) {
      const err = error as any;
      console.error("Error:", err.response?.data || err.message);
      setNotification({ status: "error", message: "Failed to save news" });
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
              <div className="flex gap-4">
                <div className="flex-1 -mr-10 relative" ref={imageRef}>
                  <div
                    className="relative"
                    style={{ width: "70vh", height: "35vh" }}
                  >
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt="Uploaded Preview"
                        fill
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div
                      onClick={handleImageClick}
                      className="absolute top-0 left-0 w-full h-full bg-black opacity-40 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300 cursor-pointer z-10"
                    >
                      <span className="pointer-events-none">
                        Upload New Picture
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="w-[45%] h-[35vh]"
                  ref={mapContainerRef}
                  style={{ height: "35vh" }}
                ></div>
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
      </div>
    </>
  );
};

export default AddNewsPage;
