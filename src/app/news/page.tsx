"use client";

import { FC, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const NewsPage: FC = () => {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [rows, setRows] = useState(Array.from({ length: 5 }, (_, index) => `00${index + 4}`));
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>("News");

  const handleDeleteClick = (rowId: string) => {
    setSelectedRowId(rowId);
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setSelectedRowId(null);
  };

  const handleConfirm = () => {
    if (selectedRowId) {
      setRows((prevRows) => prevRows.filter((id) => id !== selectedRowId));
    }
    setIsPopupVisible(false);
    setSelectedRowId(null);
  };

  const handleSidebarItemClick = (item: string) => {
    setSelectedSidebarItem(item);
  };

  const getSidebarImage = (item: string) => {
    switch (item) {
      case "Overview":
        return "/overview.png"; // Path to overview image
      case "Case":
        return "/case.png"; // Path to case image
      case "News":
        return "/news.png"; // Path to news image
      case "Admin management":
        return "/admin.png"; // Path to admin management image
      default:
        return ""; // Default fallback if none of the items match
    }
  };

  return (
    <>
      <Head>
        <title>News Page</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-gray-100 flex h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-white h-full shadow-[4px_0_8px_rgba(0,0,0,0.3)] z-10">
          <div className="flex items-center px-5 py-4 border-b">
            <Image
              src="/Logo.png"
              alt="Marong Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="mt-4">
            <ul>
              {["Overview", "Case", "News", "Admin management"].map((item) => (
                <li
                  key={item}
                  className={`relative flex items-center ml-2 py-2 px-4 rounded-lg cursor-pointer ${
                    selectedSidebarItem === item
                      ? "bg-blue-200 text-blue-800"
                      : "text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                  }`}
                  onClick={() => handleSidebarItemClick(item)}
                >
                  {/* Dark blue vertical line */}
                  <span
                    className={`absolute left-0 top-0 h-full w-1 ${
                      selectedSidebarItem === item
                        ? "bg-blue-900"
                        : "bg-transparent hover:bg-blue-900"
                    }`}
                  ></span>

                  {/* Sidebar icon and text */}
                  <Image
                    src={getSidebarImage(item)} // Get the corresponding image for each item
                    alt={`${item} icon`}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                  <i
                    className={`ml-3 mr-2 ${
                      item === "Overview"
                        ? "fas fa-home"
                        : item === "Case"
                        ? "far fa-folder"
                        : item === "News"
                        ? "far fa-file-alt"
                        : "fas fa-user-cog"
                    }`}
                  ></i>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-4">
            <div className="flex items-center">
              <Image
                src="/adminpfp.png"
                alt="admin profile picture"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <div className="text-gray-900">Admin name</div>
                <div className="text-gray-500 text-sm">Master Admin</div>
              </div>
            </div>
            <div className="flex items-center mt-3">
              <Image
                src="/Logout.png"
                alt="logout icon"
                width={25}
                height={25}
                className="rounded-full"
              />
              <a
                href="#"
                className="ml-2 text-gray-600 hover:text-gray-800 flex items-center"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Log Out
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between w-[87%] mx-auto">
              {/* Heading */}
              <div className="text-3xl font-bold">NEWS</div>

              {/* Add News Button */}
              <button
                // onClick={() => setIsAddNewsVisible(true)} // Assuming this triggers the popup
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
            <table className="w-[85%] mx-auto table-fixed" style={{ height: "120px" }}>
              <thead>
                <tr className="text-gray-500">
                  <th className="p-2 pr-[13%]">Picture</th>
                  <th className="p-2 pr-[7%]">ID</th>
                  <th className="p-2 pr-[1%]">Title</th>
                  <th className="p-2 pr-[1%]">Date</th>
                  <th className="p-2 pr-[30%]" style={{ width: "270px", height: "120px" }}>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {rows.map((rowId) => (
                    <tr
                      key={rowId}
                      className="bg-[#E9ECF9] rounded-lg shadow-lg"
                      style={{
                        width: "90%",
                        margin: "1rem auto",
                        display: "table",
                      }}
                    >
                      <td
                        className="p-2 border pl-[3%] w-60 h-120"
                        style={{ width: "280px", height: "120px" }}
                      >
                        <Image
                          src="/newsimage.png" // You can replace with dynamic logic as needed
                          alt="news image"
                          width={150}
                          height={100}
                          className="rounded-lg"
                          style={{ objectFit: 'cover' }} // Ensures the image covers the area without stretching
                        />
                      </td>
                      <td className="p-2 border" style={{ width: "215px", height: "120px" }}>
                        {rowId}
                      </td>
                      <td className="p-2 border" style={{ width: "200px", height: "120px" }}>
                        Detail
                      </td>
                      <td className="p-2 border">Date</td>
                      <td className="p-2 border">
                        <a href="/news/editnews" className="text-blue-600 hover:underline">
                          Edit
                        </a>
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteClick(rowId)}
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
