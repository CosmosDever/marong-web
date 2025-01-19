"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "../component/Sidebar";
import Link from "next/link";

import { useRouter } from "next/navigation";

interface News {
  id: number;
  title: string;
  date: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [notification, setNotification] = useState<any>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchNews = async () => {
  //     try {
  //       const response = await fetch("/api/news");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setNews(data.data); // Use the `data` property from the API response
  //       } else {
  //         console.error("Failed to fetch news data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching news:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchNews();
  // }, []);

  const newsData = {
    status: "success",
    data: [
      {
        id: 1,
        title: "Road Repair Scheduled",
        picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/f107145c5f893f2b7ca9a00a40d6abbe8fac04eb.jpg",
        content: "The government has scheduled road repairs for the upcoming week.",
        type: "Road",
        date: "2024-12-30",
        location: {
          coordinates: [100.4171, 13.7367],  // Add the coordinates here
          description: "Bangkok, Thailand"
        }
      },
      {
        id: 2,
        title: "Pavement Damage Alert",
        picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/f107145c5f893f2b7ca9a00a40d6abbe8fac04eb.jpg",
        content: "Authorities have issued an alert about damaged pavements in downtown.",
        type: "Pavement",
        date: "2024-12-29",
        location: {
          coordinates: [100.5183, 13.7361],  // Add the coordinates here
          description: "Downtown Bangkok, Thailand"
        }
      }
    ]
  };
  
  
  useEffect(() => {
    setNews(newsData.data);
    setIsLoading(false);
  }, []);

  const handleAddNewsClick = () => {
    router.push("/news/addnews"); // Navigate to /news/addnews
  };


  const handleDeleteClick = (rowId: number) => {
    setSelectedRowId(rowId);
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setSelectedRowId(null);
  };

  const handleConfirm = () => {
    if (selectedRowId !== null) {
      setNews((prevNews) => prevNews.filter((item) => item.id !== selectedRowId));
    }
    setIsPopupVisible(false);
    setSelectedRowId(null);
  };

  return (
    <>
      <div className="bg-gray-100 flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
            <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between w-[87%] mx-auto">
              {/* Heading */}
              <div className="text-3xl font-bold">NEWS</div>

              {/* Add News Button */}
              <button
              onClick={handleAddNewsClick} // Call the handler when the button is clicked
              className="text-blue-600 flex items-center mr-10"
            >
              <Image
                src="/Addbtn.png" // Path to your image
                alt="Add News"
                width={30} // Adjust width as needed
                height={30} // Adjust height as needed
                className="mr-2" // Adds margin to the right of the image to space it from the text
              />
              <span className="translate-y-1">Add News</span> {/* Moves text down by 1% */}
              </button>
            </div>

            {/* Table Header */}
            <table className="w-[90%] mx-auto table-fixed" style={{ height: "120px" }}>
              <thead>
              <tr className="text-gray-500">
                <th className="p-2 text-center align-middle" // Centers horizontally and vertically
                    style={{ width: "190px", height: "120px" }}>Picture</th>
                <th className="p-2 text-center align-middle" // Centers horizontally and vertically
                    style={{ width: "200px", height: "120px" }}>ID</th>
                <th className="p-2 text-center align-middle" // Centers horizontally and vertically
                    style={{ width: "200px", height: "120px" }}>Title</th>
                <th className="p-2 text-center align-middle" // Centers horizontally and vertically
                    style={{ width: "260px" }}>Date</th>
                <th className="p-2 pr-[16%]" style={{ width: "270px", height: "120px" }}>
                Edit
                </th>
              </tr>
              </thead>
            </table>
            </div>

          {/* Table Content */}
          <div
            className="flex-1 mt-4 p-4 rounded-lg bg-[#dee3f6] h-[80%] w-[83.4%] absolute left-61 right-0 bottom-0 overflow-auto border-t-4"
            style={{ borderTopColor: "#BAC5ED" }}
          >
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody>
                    {news.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-[#E9ECF9] rounded-lg shadow-lg"
                        style={{
                          width: "90%",
                          margin: "1rem auto",
                          display: "table",
                        }}
                      >
                        {/* Static Image */}
                        <td
                          className="p-2 border pl-[3%] w-60 h-120"
                          style={{ width: "200px", height: "120px" }}
                        >
                          <Image
                            src="/newsimage.png" // Static image path
                            alt="news image"
                            width={150}
                            height={100}
                            className="rounded-lg"
                            style={{ objectFit: "cover" }}
                          />
                        </td>
                        {/* Dynamic Data */}
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "190px", height: "120px" }}
                        >
                          {item.id}
                        </td>
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "200px", height: "120px" }}
                        >
                          {item.title}
                        </td>
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "260px" }} // Adjusted width for date column
                        >
                          {item.date}
                        </td>
                        {/* Edit Column */}
                        <td className="p-2 border text-center align-middle" style={{ width: "100px" }}>
                          <Link
                            href={`/news/${item.id}/edit`}
                            className="text-blue-600 hover:underline"
                          >
                            <Image
                              src="/editbutton.png"
                              alt="Edit Button"
                              width={20}
                              height={20}
                              className="inline-block"
                            />
                          </Link>
                        </td>
                        {/* Delete Column */}
                        <td className="p-2 border">
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-600 ml-2"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Popup */}
        {isPopupVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <div className="text-center text-lg font-bold mb-4">
                Confirm to delete News ID: {selectedRowId}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsPage;
