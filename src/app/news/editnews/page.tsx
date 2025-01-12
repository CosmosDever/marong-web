"use client";

import { FC, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Sidebar from "../../component/Sidebar";


const EditPage: FC = () => {


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
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between w-[87%] mx-auto">
              {/* Heading */}
              <div className="text-3xl font-bold">NEWS</div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center mt-10 relative">
              {/* News Image */}
              <Image
                src="/newsimage.png"
                alt="News Image"
                width={1000}
                height={0}
                className="rounded-lg"
                style={{
                  width: "50%",
                  height: "auto",
                }}
              />

              {/* Text Box with Overlapping Button */}
              <div className="relative mt-4 w-3/5">
                <textarea
                  placeholder="Enter text here..."
                  className="w-full p-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={7}
                ></textarea>
                <button
                  className="absolute bottom-5 right-2 bg-[#2243C4] text-white px-8 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                >
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPage;
