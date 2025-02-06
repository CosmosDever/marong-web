"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "../component/sidebar";

import { useRouter } from "next/navigation";
import Link from "next/link";






interface NewsLocation {
  coordinates: [string, string]; // Array of two strings representing coordinates
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
  data: NewsDetails[]; // Array of news items
}

const NewsPage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [notification, setNotification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const router = useRouter();
  const [isButtonLocked, setIsButtonLocked] = useState(true);

  const [newsData, setNewsData] = useState<NewsDetails[] | null>(null);
  const [news, setNews] = useState<NewsDetails[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchNewsData = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setNewsError("No token found");
        setNewsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/News/all", {
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
          const formattedNews = data.data.map((newsItem: NewsDetails) => ({
            id: newsItem.id,
            picture: newsItem.picture,
            title: newsItem.title,
            date: newsItem.date,
            type: newsItem.type,
            location: {
              coordinates: ["100.5171", "13.7367"], // Hardcoded for testing
              description: newsItem.location.description,
            },
            content: newsItem.content,
          }));
          setNewsData(formattedNews as NewsDetails[]); // Save the news data to state
          console.log("Fetching news...");

        } else {
          throw new Error(data.statusMessage || "Failed to fetch news data");
        }
      } catch (err: any) {
        setNewsError(err.message);
      } finally {
        setNewsLoading(false);
      }
    };
  
    fetchNewsData();
  }, []);



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

  // const newsData = {
  //   status: "success",
  //   data: [
  //     {
  //       id: 1,
  //       title: "Road Repair Scheduled",
  //       picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/f107145c5f893f2b7ca9a00a40d6abbe8fac04eb.jpg",
  //       content: "The government has scheduled road repairs for the upcoming week.",
  //       type: "Road",
  //       date: "2024-12-30",
  //       location: {
  //         coordinates: [100.4171, 13.7367],  // Add the coordinates here
  //         description: "Bangkok, Thailand"
  //       }
  //     },
  //     {
  //       id: 2,
  //       title: "Pavement Damage Alert",
  //       picture: "https://storage.googleapis.com/traffy_public_bucket/attachment/2025-01/f107145c5f893f2b7ca9a00a40d6abbe8fac04eb.jpg",
  //       content: "Authorities have issued an alert about damaged pavements in downtown.",
  //       type: "Pavement",
  //       date: "2024-12-29",
  //       location: {
  //         coordinates: [100.5183, 13.7361],  // Add the coordinates here
  //         description: "Downtown Bangkok, Thailand"
  //       }
  //     }
  //   ]
  // };
  
  
  useEffect(() => {
    if (newsData) {
      setNews(newsData.map((newsItem) => ({
        id: newsItem.id,
        picture: newsItem.picture,
        title: newsItem.title,
        date: newsItem.date,
        location: newsItem.location,
        content: newsItem.content,
        type: newsItem.type,
      })));
    }
    setIsLoading(false);
  }, [newsData]);
  

  const handleAddNewsClick = () => {
    router.push("/news/addnews"); // Navigate to /news/addnews
  };


  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authorized. Please log in.");
      return router.push("/login");
    }
  
    if (!selectedRowId) {
      setError("No row selected for deletion.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(`http://localhost:8080/api/News/${selectedRowId}/Delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the news item.");
      }
  
      setNotification({ message: "News item deleted successfully" });
      setIsPopupVisible(false);
  
      // Refresh the news list
      await refreshNewsList();
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred while deleting the news item.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDeleteClick = (rowId: string) => {
    setSelectedRowId(rowId);
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setSelectedRowId(null);
  };

  const handleConfirm = () => {
    if (selectedRowId !== null) {
      handleDelete();
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      setIsButtonLocked(true);
      setTimeout(() => setIsButtonLocked(false), 2000);
    }
  }, [isPopupVisible]);


  const refreshNewsList = async () => {
    setNewsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/News/all", {
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
        setNewsData(data.data);
      } else {
        throw new Error(data.statusMessage || "Failed to refresh news data.");
      }
    } catch (error: any) {
      setNewsError(error.message);
    } finally {
      setNewsLoading(false);
    }
  };



  return (
    <>
      <div className="bg-gray-100 flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100 h-full overflow-auto">
          <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-[87%] mx-auto">
              {/* Heading */}
              <div className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">NEWS</div>

              {/* Add News Button */}
              <button
                onClick={handleAddNewsClick}
                className="text-blue-600 flex items-center transition-all duration-500 hover:scale-110 hover:text-blue-700"
              >
                <Image
                  src="/Addbtn.png"
                  alt="Add News"
                  width={30}
                  height={30}
                  className="mr-2 transition-all duration-500 hover:scale-110"
                />
                <span className="translate-y-1">Add News</span>
              </button>

            </div>

            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full ml-[-1%] table-fixed mt-[5vh] ">
                <thead>
                  <tr className="text-gray-500">
                    <th className="p-2 text-center align-middle w-1/5">Picture</th>
                    <th className="p-2 text-center align-middle w-1/5 pr-[6vh]">ID</th>
                    <th className="p-2 text-center align-left w-1/5 pr-[14vh]">Title</th>
                    <th className="p-2 text-center align-middle w-1/5 pr-[20vh]">Date</th>
                    <th className="p-2 text-center align-middle w-1/5 pr-[30vh]">Edit</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          {/* Table Content */}
          <div
            className="flex-1 mt-[-1vh] p-4 rounded-lg bg-[#dee3f6] w-full md:w-[100%] mx-auto overflow-auto border-t-4"
            style={{ borderTopColor: "#BAC5ED" }}
          >
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left md:w-[97%] ml-[1%]">
                  <tbody>
                    {newsData && newsData.map((news) => (
                      <tr
                        key={news.id}
                        className="bg-[#E9ECF9] rounded-lg shadow-lg mb-4"
                        style={{

                          display: "table",
                        }}
                      >
                        {/* Static Image */}
                        <td className="p-2 border w-1/5">
                          <img
                            src={news.picture || "/placeholder-image.png"}
                            alt="news image"
                            className="rounded-lg w-full h-24 object-cover"
                          />
                        </td>
                        {/* Dynamic Data */}
                        <td className="p-2 border text-center align-middle w-1/5">
                          {news.id}
                        </td>
                        <td className="p-2 border text-center align-middle w-1/5">
                          {news.title}
                        </td>
                        <td className="p-2 border text-center align-middle w-1/5">
                          {news.date}
                        </td>
                        {/* Edit Column */}
                        <td className="p-2 border text-center align-middle w-1/5">
                          <Link
                            href={`/news/${news.id}/edit`}
                            className="text-blue-600 hover:underline"
                          >
                            <Image
                              src="/editbutton.png"
                              alt="Edit Button"
                              width={25}
                              height={20}
                              className="inline-block transition-transform duration-300 hover:scale-125"
                            />
                          </Link>
                        </td>

                        {/* Delete Column */}
                        <td className="p-2 border text-center align-middle w-1/5 pr-[5vh]">
                          <button
                            onClick={() => handleDeleteClick(news.id)}
                            className="text-red-600 hover:underline"
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
            <div className="bg-white rounded-lg shadow-lg w-full md:w-[60vh] p-6 text-center">
              {/* Image at the top */}
              <img
                src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png"
                alt="Delete Icon"
                className="w-12 h-12 mx-auto mb-4"
              />
              
              {/* Confirmation Text */}
              <div className="text-lg font-bold">
                Confirm to delete News ID: {selectedRowId}
              </div>
              
              {/* Buttons */}
              <div className="flex justify-evenly mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={isButtonLocked ? undefined : handleConfirm}
                  disabled={isButtonLocked}
                  className={`px-4 py-2 w-24 h-10 flex items-center justify-center rounded-lg text-white transition ${
                    isButtonLocked ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isButtonLocked ? (
                    <img
                      src="https://i.pinimg.com/474x/43/0f/2d/430f2d8037e7be4f47db6821f812c630.jpg"
                      alt="Locked"
                      className="w-6 h-6"
                    />
                  ) : (
                    "Confirm"
                  )}
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