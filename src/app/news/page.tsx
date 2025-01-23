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
                    {newsData && newsData.map((news) => (
                      <tr
                        key={news.id}
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
                          src={news.picture || "/placeholder-image.png"}
                          alt="news image"
                          width={150}
                          height={120} // Adjusted height to fit the row height
                          className="rounded-lg"
                          style={{ objectFit: "cover", height: "100%" }} // Ensure the image fits the row height
                          />
                        </td>
                        {/* Dynamic Data */}
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "190px", height: "120px" }}
                        >
                          {news.id}
                        </td>
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "200px", height: "120px" }}
                        >
                          {news.title}
                        </td>
                        <td
                          className="p-2 border text-center align-middle" // Centers horizontally and vertically
                          style={{ width: "260px" }} // Adjusted width for date column
                        >
                          {news.date}
                        </td>
                        {/* Edit Column */}
                        <td className="p-2 border text-center align-middle" style={{ width: "100px" }}>
                          <Link
                            href={`/news/${news.id}/edit`}
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
                            onClick={() => handleDeleteClick(news.id)}
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
