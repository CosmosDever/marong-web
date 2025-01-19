// "use client";

// import { FC, useState, useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import Head from "next/head";
// import Image from "next/image";
// import Sidebar from "../../component/Sidebar";
// import "mapbox-gl/dist/mapbox-gl.css";
// import mapboxgl from "mapbox-gl";

// const EditNewsPage: FC = () => {
//   const searchParams = useSearchParams();
//   const [newsData, setNewsData] = useState<any>(null); // Store news data
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [markerCoordinates, setMarkerCoordinates] = useState<[number, number]>([0, 0]); // Store coordinates of the marker
//   const [showUploadPopup, setShowUploadPopup] = useState(false); // Control visibility of the upload popup
//   const imageRef = useRef<HTMLDivElement | null>(null); // Reference to the image container
//   const mapContainerRef = useRef<HTMLDivElement | null>(null); // Reference to the map container

//   useEffect(() => {
//     const newsDataParam = searchParams.get("newsData");
//     if (newsDataParam) {
//       try {
//         const decodedData = decodeURIComponent(newsDataParam); // Decode the URL parameter
//         const parsedData = JSON.parse(decodedData); // Parse the JSON string into an object
//         setNewsData(parsedData.data[0]); // Assuming the data you want is in the first item
//       } catch (error) {
//         console.error("Error parsing news data:", error);
//       } finally {
//         setLoading(false); // Stop loading once data is processed
//       }
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (newsData && mapContainerRef.current) {
//       // Initialize the map after newsData is loaded and the container is available
//       mapboxgl.accessToken = "pk.eyJ1IjoicHJhbTQ3IiwiYSI6ImNtNXRzMzdnZDEwZjkyaXEwbzU3Y2J2cnQifQ.3e4ZNgqhVduJkxgtzMCkUw"; // Make sure to set your token here
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: "mapbox://styles/mapbox/streets-v12", // Style of the map
//         center: [newsData.location.coordinates[0], newsData.location.coordinates[1]], // Set center of map based on newsData
//         zoom: 12, // Initial zoom level
//       });

//       const marker = new mapboxgl.Marker({ draggable: true })
//         .setLngLat([newsData.location.coordinates[0], newsData.location.coordinates[1]]) // Place marker at coordinates from newsData
//         .addTo(map);

//       // Update coordinates when marker is dragged
//       const onDragEnd = () => {
//         const lngLat = marker.getLngLat();
//         setMarkerCoordinates([lngLat.lng, lngLat.lat]); // Save the new coordinates in the state
//       };

//       marker.on("dragend", onDragEnd);

//       return () => {
//         map.remove(); // Clean up the map when the component is unmounted
//       };
//     }
//   }, [newsData]);

//   const handleCancel = () => {
//     // Logic for canceling (for example, navigate away or reset the form)
//     alert("Changes canceled");
//   };

//   const handleSave = () => {
//     // Logic for saving changes
//     alert("Changes saved");
//   };

//   const handleImageClick = () => {
//     setShowUploadPopup(true); // Show the upload popup when the image is clicked
//   };

//   const handleUploadClose = () => {
//     setShowUploadPopup(false); // Close the upload popup
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
//   {/* Container for the image and overlay */}
//   <div 
//   className="relative" 
//   style={{ width: "70vh", height: "35vh" }} // Explicit dimensions for the container
// >
//   {/* Image */}
//   <Image
//     src={newsData.picture}
//     alt={newsData.title}
//     fill
//     className="rounded-lg object-cover" // Use "fill" to ensure it fills the container
//   />

//   {/* Overlay */}
//   <div
//     className="absolute top-0 left-0 w-full h-full bg-black opacity-20 text-white flex items-center justify-center text-xl rounded-lg hover:opacity-70 transition-opacity duration-300"
//   >
//     <span className="pointer-events-none">Upload New Picture</span>
//   </div>

//   {/* Clickable Area */}
//   <div
//     onClick={handleImageClick}
//     className="absolute top-0 left-0 w-full h-full cursor-pointer pointer-events-auto"
//   ></div>
// </div>

// </div>


//                 <div className="w-[45%] h-[35vh]" ref={mapContainerRef}></div> {/* Map container */}
//               </div>

//               <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Title:</label>
//                   <input
//                     type="text"
//                     defaultValue={newsData.title}
//                     className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="col-span-1">
//                   <label className="block text-gray-700 font-semibold">Location Description:</label>
//                   <textarea
//                     defaultValue={newsData.location.description}
//                     className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={1}
//                   ></textarea>
//                 </div>

//                 <div className="col-span-2">
//                   <label className="block text-gray-700 font-semibold">Content:</label>
//                   <textarea
//                     defaultValue={newsData.content}
//                     className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows={3}
//                   ></textarea>
//                 </div>
//               </div>

//               <div className="relative mt-4 flex justify-end gap-4">
//                 <button
//                   onClick={handleCancel}
//                   className="bg-gray-500 text-white px-8 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   className="bg-[#2243C4] text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none "
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Upload Popup */}
//           {showUploadPopup && (
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
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditNewsPage;


