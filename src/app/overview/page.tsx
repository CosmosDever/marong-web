"use client";

import { FC } from "react";
import Head from "next/head";
import Sidebar from "../component/sidebar"; // Adjust the import path to the actual location of your Sidebar component

const OverviewPage: FC = () => {
  return (
    <>
      <Head>
        <title>Overview Page</title>
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
              <div className="text-3xl font-bold">OVERVIEW</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewPage;
