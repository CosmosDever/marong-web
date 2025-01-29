

"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../../component/sidebar";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { GoogleMap, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { uploadImage } from "../../../component/imageUpload";
import axios from "axios";


interface NewsLocation {
  coordinates: [string, string]; // Latitude and longitude as strings
  description: string; // Location description
}

interface NewsDetails {
  id: string; // Unique identifier for the news
  picture: string; // URL of the news image
  title: string; // Title of the news
  date: string; // Date of the news (YYYY-MM-DD format)
  location: NewsLocation; // Location details
  content: string; // Content or description of the news
  type: string; // Type/category of the news
}

interface NewsApiResponse {
  statusCode: string; // API response status code
  statusMessage: string; // API response message
  data: NewsDetails; // News details for the specific ID
}


const EditNewsPage: FC = () => {
  const router = useRouter();
  const { id }: { id: string } = useParams();
  const [newsData, setNewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([0, 0]);
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

  const [news, setNews] = useState<NewsDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState<{
    title: string;
    location: {
      coordinates: [number, number];
      description: string;
    };
    content: string;
    picture: string | File;
  }>({
    title: "",
    location: {
      coordinates: [0, 0], // Default coordinates
      description: "",
    },
    content: "",
    picture: "",
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCrrohIKFYapXv-xhk9swyHjk6RwT0EpIA",
    libraries: ["places"],
  });

  const fetchNewsById = async (id: string): Promise<NewsDetails | null> => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
  
    if (!token) {
      console.error("No token found");
      return null;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/News/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data: NewsApiResponse = await response.json();
  
      if (data.statusCode === "200") {
        const formattedNews = {
          id: data.data.id,
          // picture: data.data.picture,
          picture: data.data.picture,
          title: data.data.title,
          date: data.data.date,
          type: data.data.type,
          location: {
            coordinates: data.data.location.coordinates, 
            description: data.data.location.description,
          },
          content: data.data.content,
        };
        return formattedNews; // Return the news details
      } else {
        throw new Error(data.statusMessage || "Failed to fetch news data");
      }
    } catch (error) {
      console.error("Error fetching news by ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading starts
      const fetchedData = await fetchNewsById(id);
      if (fetchedData) {
        setNewsData(fetchedData);
  
        // Set the default values from the fetched data
        setTitle(fetchedData.title);
        setDescription(fetchedData.location.description);
        setContent(fetchedData.content);
        setMarkerCoordinates([parseFloat(fetchedData.location.coordinates[1]), parseFloat(fetchedData.location.coordinates[0])]);
      }
      setLoading(false); // Stop loading after fetch
    };
  
    if (id) {
      fetchData();
    }
  }, [id]);
  

  
  


  useEffect(() => {
    if (newsData && mapContainerRef.current) {
      if (mapContainerRef.current.clientHeight === 0) return;
  
      mapboxgl.accessToken =
        "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";
  
      if (!mapboxgl.supported()) {
        console.error("Your browser does not support Mapbox GL");
        return;
      }
  
      const parsedCoordinates = [
        parseFloat(markerCoordinates[0].toString()),
        parseFloat(markerCoordinates[1].toString()),
      ] as [number, number];
  
      const isValidCoordinate = (value: number, min: number, max: number) => {
        return !isNaN(value) && value >= min && value <= max;
      };
  
      if (
        isValidCoordinate(parsedCoordinates[0], -180, 180) &&
        isValidCoordinate(parsedCoordinates[1], -90, 90)
      ) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: parsedCoordinates,
          zoom: 12,
        });
  
        const marker = new mapboxgl.Marker({ draggable: true })
          .setLngLat(parsedCoordinates)
          .addTo(map);
  
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          setMarkerCoordinates([lngLat.lat, lngLat.lng]);
        });
  
        return () => map.remove();
      } else {
        console.error("Invalid coordinates for map:", parsedCoordinates);
      }
    }
  }, [newsData, markerCoordinates]);
  
  

  


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

  
  
  
  // const handleSave = async () => {
  //   const token = localStorage.getItem("token");
  //   console.log(token);
  //   if (!token) {
  //     setError("You are not authorized. Please log in.");
  //     return router.push("/login");
  //   }
  
  //   setLoading(true);
  //   setError("");
  
  //   try {
  //     let imageUrl = "";
  //     if (formData.picture instanceof File) {
  //       try {
  //         imageUrl = await uploadImage(formData.picture);
  //       } catch (uploadError) {
  //         setError("Failed to upload image. Please try again.");
  //         setLoading(false);
  //         return;
  //       }
  //     }
  //     const payload = {
  //       title,
  //       content,
  //       location_description: formData.location.description,
  //       latitude: String(markerCoordinates[0]),
  //       longitude: String(markerCoordinates[1]),
  //       picture: formData.picture || newsData.picture,
  //     };
  
  //     const response = await fetch(`http://localhost:8080/api/News/${id}/Edit`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to update news.");
  //     }
  
  //     const data = await response.json();
  
  //     if (data.statusCode === "200") {
  //       setNotification({ message: "News updated successfully", data });
  //       router.push(`/news/${id}/Edit`);
  //     } else {
  //       setError(data.statusMessage || "An error occurred while updating the news.");
  //     }
  //   } catch (error: any) {
  //     setError(error.message || "An unexpected error occurred.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const API_BASE_URL = "http://localhost:8080/api"; // Define your API base URL

const handleSave = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setNotification({ status: "error", message: "Authentication token is missing" });
    return;
  }

  setLoading(true);
  setError("");

  try {

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("location_description", formData.location.description);
    formDataToSend.append("latitude", markerCoordinates[0].toString());
    formDataToSend.append("longitude", markerCoordinates[1].toString());
    formDataToSend.append("type", "news");
    formDataToSend.append("picture", formData.picture); // Assuming picture URL is in the state
 

    const response = await axios.patch(`/api/News/${id}/Edit`, formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      const errorData = response.data;
      console.error("Error Data:", errorData); // Log the error response body
      throw new Error(errorData.message || "Failed to update news.");
    }

    const data = response.data;

    if (data.statusCode === "200") {
      setNotification({ message: "News updated successfully" });
      setTimeout(() => {
        router.push(`/news`);
      }, 1000);
    } else {
      setError(data.statusMessage || "An error occurred while updating the news.");
    }
  } catch (error: any) {
    setError(error.message || "An unexpected error occurred.");
  } finally {
    setLoading(false);
  }
};




  const handleCancel = () => {
    if (newsData) {
      // Reset formData and individual state to the original fetched data
      setFormData({
        title: newsData.title || "",
        location: {
          coordinates: [parseFloat(newsData.location.coordinates[0]), parseFloat(newsData.location.coordinates[1])],
          description: newsData.location.description || "",
        },
        content: newsData.content || "",
        picture: newsData.picture || "",
      });
  
      // Optionally reset individual state (if still used)
      setTitle(newsData.title);
      setDescription(newsData.location.description);
      setContent(newsData.content);
      setImagePreview(newsData.picture || ""); // Reset image preview
      setMarkerCoordinates([
        parseFloat(newsData.location.coordinates[1]),
        parseFloat(newsData.location.coordinates[0]),
      ]);
    }
  };
  

  const handleImageClick = () => {
    setShowUploadPopup(true);
  };

  const handleUploadClose = () => {
    setShowUploadPopup(false);
    // if (!formData.picture || typeof formData.picture === "string") {
    //   setImagePreview(null); // Only reset if no new image is selected
    // }
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title,
        location: {
          coordinates: newsData.location.coordinates,
          description: newsData.location.description,
        },
        content: newsData.content,
        picture: newsData.picture,
      });
    }
  }, [newsData]);
  


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
                  <img
                    src={imagePreview || newsData.picture || "/newsimage.png"}
                    alt="news image"
                    // fill
                    className="rounded-lg object-cover"
                  />
                    <div
                      onClick={handleImageClick}
                      className="absolute top-0 left-0 w-full h-full bg-black opacity-40 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300 cursor-pointer z-10"
                    >
                      <span className="pointer-events-none">Upload New Picture</span>
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
  value={formData.title} // Directly use formData.title
  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }))
  }
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
  value={formData.location.description} // Directly use formData.location.description
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
  value={formData.content} // Directly use formData.content
  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFormData((prev) => ({
      ...prev,
      content: e.target.value,
    }))
  }
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
                  <pre className="text-sm">{JSON.stringify(notification.data, null, 2)}</pre>
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
                      className="w-full"
                    />
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
        </div>
      </div>
    </>
  );
};

export default EditNewsPage;
