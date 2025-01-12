"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var navigation_1 = require("next/navigation"); // Import useRouter for navigation
var head_1 = require("next/head");
var image_1 = require("next/image");
var Sidebar_1 = require("../component/Sidebar");
var NewsPage = function () {
    var _a = (0, react_1.useState)(null), selectedRowId = _a[0], setSelectedRowId = _a[1];
    var _b = (0, react_1.useState)(false), isPopupVisible = _b[0], setIsPopupVisible = _b[1];
    var _c = (0, react_1.useState)(Array.from({ length: 5 }, function (_, index) { return "00".concat(index + 4); })), rows = _c[0], setRows = _c[1];
    var _d = (0, react_1.useState)("News"), selectedSidebarItem = _d[0], setSelectedSidebarItem = _d[1];
    var router = (0, navigation_1.useRouter)(); // Initialize the router
    var handleDeleteClick = function (rowId) {
        setSelectedRowId(rowId);
        setIsPopupVisible(true);
    };
    var handleCancel = function () {
        setIsPopupVisible(false);
        setSelectedRowId(null);
    };
    var handleConfirm = function () {
        if (selectedRowId) {
            setRows(function (prevRows) { return prevRows.filter(function (id) { return id !== selectedRowId; }); });
        }
        setIsPopupVisible(false);
        setSelectedRowId(null);
    };
    return (<>
      <head_1.default>
        <title>News Page</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"/>
      </head_1.default>
      <div className="bg-gray-100 flex h-screen">
        {/* Sidebar */}
        <Sidebar_1.default />

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
    className="text-blue-600 flex items-center mr-10">
                <image_1.default src="/Addbtn.png" // Path to your image
     alt="Add News" width={30} // Adjust width as needed
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
          <div className="flex-1 mt-4 p-4 rounded-lg bg-[#dee3f6] h-[80%] w-[83.4%] absolute left-61 right-0 bottom-0 overflow-auto border-t-4" style={{ borderTopColor: "#BAC5ED" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {rows.map(function (rowId) { return (<tr key={rowId} className="bg-[#E9ECF9] rounded-lg shadow-lg" style={{
                width: "90%",
                margin: "1rem auto",
                display: "table",
            }}>
                      <td className="p-2 border pl-[3%] w-60 h-120" style={{ width: "280px", height: "120px" }}>
                        <image_1.default src="/newsimage.png" // You can replace with dynamic logic as needed
         alt="news image" width={150} height={100} className="rounded-lg" style={{ objectFit: 'cover' }} // Ensures the image covers the area without stretching
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
                          <image_1.default src="/editbutton.png" alt="Edit Button" width={20} height={20} className="inline-block"/>
                        </a>
                      </td>

                      <td className="p-2 border">
                        <button onClick={function () { return handleDeleteClick(rowId); }} className="text-red-600 ml-2" style={{ color: "E03515" }}>
                          
                          Delete
                        </button>
                      </td>
                    </tr>); })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popup */}
        {isPopupVisible && (<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
              <div className="text-center text-lg font-bold mb-4">
                Confirm to delete News ID: {selectedRowId}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Confirm
                </button>
              </div>
            </div>
          </div>)}
      </div>
    </>);
};
exports.default = NewsPage;
