// "use client";

// import { FC, useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Head from "next/head";
// import Image from "next/image";
// import Sidebar from "../../../component/Sidebar";
// import "mapbox-gl/dist/mapbox-gl.css";
// import mapboxgl from "mapbox-gl";
// import LocationAutocomplete from "../../../component/LocationAutocomplete";

// const EditNewsPage: FC = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [newsData, setNewsData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([0, 0]);
//   const [showUploadPopup, setShowUploadPopup] = useState(false);
//   const [notification, setNotification] = useState<any>(null);
//   const imageRef = useRef<HTMLDivElement | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [content, setContent] = useState("");

//   useEffect(() => {
//     if (id) {
//       setLoading(true);
//       setTimeout(() => {
//         if (id === "1") {
//           setNewsData({
//             id: 1,
//             title: "City to Revamp Downtown Sidewalks",
//             location: {
//               coordinates: [100.5018, 13.7563],
//               description: "Bangkok, Thailand",
//             },
//             picture:
//               "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/0088489a5394c8e7cfa4555cdaaf7ba75a89437a.jpg",
//             type: "Sidewalks",
//             content:
//               "The city has announced revised plans to upgrade sidewalks in the downtown area. Work is expected to finish by early next year.",
//             last_updated: "2025-01-18T12:00:00Z",
//           });
//         } if (id === "2")  {
//           setNewsData({
//             id: 2,
//             title: "Pavement Damage Alert",
//             location: {
//               coordinates: [100.5183, 13.7361],
//               description: "Bangkok, Thailand",
//             },
//             picture:
//               "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/0088489a5394c8e7cfa4555cdaaf7ba75a89437a.jpg",
//             type: "Pavement",
//             content:
//               "Authorities have issued an alert about damaged pavements in downtown.",
//             last_updated: "2025-01-18T12:00:00Z",
//           });
//         }
//         setLoading(false);
//       }, 1000);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (newsData) {
//       setTitle(newsData.title);
//       setDescription(newsData.location.description);
//       setContent(newsData.content);
//       setMarkerCoordinates(newsData.location.coordinates);
//     }
//   }, [newsData]);

//   useEffect(() => {
//     if (newsData && mapContainerRef.current) {
//       if (mapContainerRef.current.clientHeight === 0) {
//         return;
//       }

//       mapboxgl.accessToken =
//         "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";

//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v12",
//         center: markerCoordinates,
//         zoom: 12,
//       });

//       const marker = new mapboxgl.Marker({ draggable: true })
//         .setLngLat(markerCoordinates)
//         .addTo(map);

//       marker.on("dragend", () => {
//         const lngLat = marker.getLngLat();
//         setMarkerCoordinates([lngLat.lng, lngLat.lat]);
//       });

//       return () => {
//         map.remove();
//       };
//     }
//   }, [newsData, markerCoordinates]);

//   const handleSave = () => {
//     const gmt7Formatter = new Intl.DateTimeFormat("en-US", {
//       timeZone: "Asia/Bangkok",
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });
  
//     const updatedData = {
//       status: "success",
//       message: "News article updated successfully.",
//       data: {
//         id: newsData.id,
//         title,
//         location: {
//           coordinates: markerCoordinates,
//           description,
//         },
//         picture: newsData.picture,
//         type: newsData.type,
//         content,
//         last_updated: gmt7Formatter.format(new Date()), // Format the date in GMT+7
//       },
//     };
  
//     setNotification(updatedData);
  
//     // Automatically hide the notification after 3 seconds
//     setTimeout(() => {
//       setNotification(null);
//     }, 3000);
//   };
  
  

//   const handleCancel = () => {
//     alert("Changes canceled");
//     setTitle(newsData.title);
//     setDescription(newsData.location.description);
//     setContent(newsData.content);
//     setMarkerCoordinates(newsData.location.coordinates);
//   };

//   const handleImageClick = () => {
//     setShowUploadPopup(true);
//   };

//   const handleUploadClose = () => {
//     setShowUploadPopup(false);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!newsData) {
//     return <div>No news data available</div>;
//   }

//   return (
//     <>
//       <Head>
//         <title>Edit News</title>
//       </Head>
//       <div className="bg-gray-100 flex h-screen">
//         <Sidebar />
//         <div className="flex-1 flex flex-col bg-gray-100 h-full">
//           <div className="p-6">
//             <div className="flex items-center justify-between w-[87%] mx-auto">
//               <div className="text-3xl font-bold">EDIT NEWS</div>
//             </div>

//             <div className="mt-10 w-[86%] mx-auto">
//               <div className="flex gap-4">
//               <div className="flex-1 -mr-10 relative" ref={imageRef}>
//   <div className="relative" style={{ width: "70vh", height: "35vh" }}>
//     <Image
//       src={newsData.picture}
//       alt={newsData.title}
//       fill
//       className="rounded-lg object-cover"
//     />
//     <div
//       onClick={handleImageClick}
//       className="absolute top-0 left-0 w-full h-full bg-black opacity-40 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300 cursor-pointer z-10"
//     >
//       <span className="pointer-events-none">Upload New Picture</span>
//     </div>
//   </div>
// </div>

//                 <div
//                   className="w-[45%] h-[35vh]"
//                   ref={mapContainerRef}
//                   style={{ height: "35vh" }}
//                 ></div>
//               </div>

//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">
//                     Title:
//                   </label>
//                   <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="col-span-1">
//   <label className="block text-gray-700 font-semibold">
//     Location Description:
//   </label>
//   <LocationAutocomplete
//     onSelect={(location) => {
//       setDescription(location.description);
//       setMarkerCoordinates(location.coordinates);
//     }}
//   />
// </div>


//                 <div className="col-span-2">
//                   <label className="block text-gray-700 font-semibold">
//                     Content:
//                   </label>
//                   <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="relative mt-4 flex justify-end gap-4 z-10">
//                 <button
//                   onClick={handleCancel}
//                   className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none z-10"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="bg-[#2243C4] text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none z-10"
//                 >
//                   Save
//                 </button>
//               </div>

//               {notification && (
//                 <div
//                   className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 mr-40"
//                   style={{ maxWidth: "600px", wordBreak: "break-word" }}
//                 >
//                   <h4 className="font-bold mb-2">{notification.message}</h4>
//                   <pre className="text-sm">{JSON.stringify(notification.data, null, 2)}</pre>
//                 </div>
//               )}
//             {showUploadPopup && (
//             <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//               <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
//                 <div className="text-2xl mb-4">Upload Image</div>
//                 <input type="file" accept="image/*" className="mb-4" />
//                 <div className="flex justify-end gap-4">
//                   <button
//                     onClick={handleUploadClose}
//                     className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditNewsPage;







































"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../../component/Sidebar";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { GoogleMap, useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const EditNewsPage: FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [newsData, setNewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([0, 0]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [notification, setNotification] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const imageRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCrrohIKFYapXv-xhk9swyHjk6RwT0EpIA",
    libraries: ["places"],
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      setTimeout(() => {
        if (id === "1") {
          setNewsData({
            id: 1,
            title: "City to Revamp Downtown Sidewalks",
            location: {
              coordinates: [100.5018, 13.7563],
              description: "Bangkok, Thailand",
            },
            picture:
              "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/0088489a5394c8e7cfa4555cdaaf7ba75a89437a.jpg",
            type: "Sidewalks",
            content:
              "The city has announced revised plans to upgrade sidewalks in the downtown area. Work is expected to finish by early next year.",
            last_updated: "2025-01-18T12:00:00Z",
          });
        } else {
          setNewsData(null);
        }
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  useEffect(() => {
    if (newsData) {
      setTitle(newsData.title);
      setDescription(newsData.location.description);
      setContent(newsData.content);
      setMarkerCoordinates(newsData.location.coordinates);
    }
  }, [newsData]);

  useEffect(() => {
    if (newsData && mapContainerRef.current) {
      if (mapContainerRef.current.clientHeight === 0) {
        return;
      }

      mapboxgl.accessToken =
        "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw";

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: markerCoordinates,
        zoom: 12,
      });

      const marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat(markerCoordinates)
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setMarkerCoordinates([lngLat.lng, lngLat.lat]);
      });

      return () => {
        map.remove();
      };
    }
  }, [newsData, markerCoordinates]);

  const handleSave = () => {
    const updatedData = {
      status: "success",
      message: "News article updated successfully.",
      data: {
        id: newsData.id,
        title,
        location: {
          coordinates: markerCoordinates,
          description,
        },
        picture: newsData.picture,
        type: newsData.type,
        content,
        last_updated: new Date().toISOString(),
      },
    };

    setNotification(updatedData);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCancel = () => {
    alert("Changes canceled");
    setTitle(newsData.title);
    setDescription(newsData.location.description);
    setContent(newsData.content);
    setMarkerCoordinates(newsData.location.coordinates);
  };

  const handleImageClick = () => {
    setShowUploadPopup(true);
  };

  const handleUploadClose = () => {
    setShowUploadPopup(false);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setDescription(place.formatted_address || "");
      if (place.geometry) {
        setMarkerCoordinates([
          place.geometry.location.lng(),
          place.geometry.location.lat(),
        ]);
      }
    }
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
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-gray-700 font-semibold">
                    Location Description:
                  </label>
                  {isLoaded && (
                    <Autocomplete
                      onLoad={(a) => setAutocomplete(a)}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </Autocomplete>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-700 font-semibold">
                    Content:
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  ></textarea>
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
        </div>
      </div>
    </>
  );
};

export default EditNewsPage;
