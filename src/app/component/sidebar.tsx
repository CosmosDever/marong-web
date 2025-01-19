"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";

const Sidebar: FC = () => {
  const currentPath = usePathname();
  const router = useRouter();
  
  const logout = (): void => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const sidebarItems = [
    { name: "Overview", route: "/overview" },
    { name: "Case", route: "/case" },
    { name: "News", route: "/news" },
    { name: "Admin management", route: "/admin" },
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
              {sidebarItems.map(({ name, route }) => (
                <Link href={route} key={name}>
                  <li
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
                    <Image
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
          <div className="flex flex-col justify-end w-full p-4 mb-[2vh]">
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
            <div className="flex items-center mt-3 py-2 rounded-lg group hover:bg-blue-100 ">
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
