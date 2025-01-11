"use client";

import { FC, useState } from "react";
import Head from "next/head";
import Image from "next/image";

const EditPage: FC = () => {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>("News");

  const handleSidebarItemClick = (item: string) => {
    setSelectedSidebarItem(item);
  };

  return (
    <>
      <Head>
        <title>Edit Page</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />
      </Head>
      <div className="bg-gray-100 flex h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-white h-full shadow-[4px_0_8px_rgba(0,0,0,0.3)] z-10">
          <div className="flex items-center px-5 py-4 border-b">
            <i className="fas fa-bullhorn text-blue-900"></i>
            <span
              className="ml-2 text-2xl font-extrabold"
              style={{ color: "#1A3293" }}
            >
              MARONG
            </span>
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
                  {/* Sidebar icon and text */}
                  <Image
                    src="https://img.lovepik.com/free-png/20220124/lovepik-square-png-image_401707831_wh1200.png"
                    alt={`${item} icon`}
                    width={40}
                    height={40}
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
                src="https://img.lovepik.com/free-png/20220124/lovepik-square-png-image_401707831_wh1200.png"
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
                src="https://img.lovepik.com/free-png/20220124/lovepik-square-png-image_401707831_wh1200.png"
                alt="logout icon"
                width={20}
                height={20}
                className="rounded-full"
              />
              <a
                href="#"
                className="ml-3 text-gray-600 hover:text-gray-800 flex items-center"
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
            <div className="text-3xl font-bold pl-[6%]">Edit Page</div>
            <div className="flex-1 mt-4 p-4 rounded-lg bg-[#dee3f6] h-[80%] w-[83.4%] absolute left-61 right-0 bottom-0 overflow-auto border-t">
              {/* Content area */}
              <p className="text-center mt-20 text-gray-600">
                This is the edit page. Content can be added here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPage;
