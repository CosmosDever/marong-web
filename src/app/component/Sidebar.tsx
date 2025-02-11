"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { id } from "date-fns/locale";

const Sidebar: FC = () => {
  const currentPath = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState({
    fullName: "",
    picture: "",
    roles: "",
    id: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/api/userdata/token/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error("Failed to fetch user data:", response.statusText);
          return;
        }
  
        const result = await response.json();
  
        if (result.statusCode === "200") {
          const { fullName, picture, roles, id } = result.data;
        
          const roleNameMatch = roles.match(/name=ROLE_(.+)\)/);
          const roleName = roleNameMatch ? roleNameMatch[1] : "Unknown Role";
        
          setUserData({ fullName, picture, roles: roleName, id });
        } else {
          console.error("Error in API response:", result.statusMessage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  }, []);

  const handleCardClick = () => {
    router.push(`/admin/adminprofile/${userData.id}`);
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const sidebarItems = [
    { name: "Overview", route: "/overview" ,id: "goto_overviewpageButton" },
    { name: "Case", route: "/case", id: "goto_casepageButton" },
    { name: "News", route: "/news", id: "goto_newspageButton" },
    { name: "Admin management", route: "/admin", id: "goto_adminpageButton" },
  ];

  const isActive = (route: string) => currentPath.startsWith(route);

  return (
    <>
    {/* Sidebar */}
      <div className="fixed w-[17vw] max-h-screen shadow-[4px_0_8px_rgba(0,0,0,0.3)] z-10 bg-white ">
        <div className="flex items-center px-5 py-4 border-b">
          <Image
            src="/Logo.png"
            alt="Marong Logo"
            width={240}
            height={80}
            className="object-contain"
          />
        </div>
        <div className="w-full h-[90vh] grid justify-between ">
          <div className="mt-4">
            <ul>
              {sidebarItems.map(({ name, route, id }) => (
                <Link href={route} key={name}>
                  <li
                  id={id}
                    className={`flex items-center ml-2 py-2 px-4 rounded-lg cursor-pointer ${
                      isActive(route)
                        ? "bg-blue-200 text-blue-800"
                        : "text-gray-800 hover:bg-blue-100 hover:text-blue-800"
                    }`}
                  >
                    <span
                      className={`absolute max-h-screen left-0 top-0 h-full w-1 ${
                        isActive(route)
                          ? "bg-blue-900"
                          : "bg-transparent hover:bg-blue-900"
                      }`}
                    ></span>
                    <img
                      src={`/${name.toLowerCase()}.png`}
                      alt={`${name} icon`}
                      width={20}
                      height={20}
                      className="rounded"
                    />
                    <i className="ml-3 mr-2 "></i>
                    {name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-end w-full p-4 mb-[2vh]" >
            <div className="flex items-center" onClick={() => handleCardClick()} id ="myProfileButton">
              <img
                src={userData.picture}
                alt="admin profile picture"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <div className="text-gray-900">{userData.fullName || "Admin name"}</div>
                <div className="text-gray-500 text-sm">{userData.roles || "Role"}</div>
                </div>
            </div>
            <div className="flex items-center mt-3 py-2 rounded-lg group hover:bg-blue-100 " id ="logoutButton" >
              <Image
                src="/Logout.png"
                alt="logout icon"
                width={25}
                height={25}
                className="rounded-full"
              />
              <a
                href="#"
                className="ml-2 text-gray-600 hover:text-gray-800 flex items-center" onClick={logout}
              >
                Log Out
              </a>
            </div>
          </div>
        </div>
      </div>
    {/* Empty Area */}
      <div className="z-1 max-h-screen w-[17vw]"></div>
    </>
  );
};

export default Sidebar;