'use client';
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import { useState, useEffect } from "react";

interface User {
  id: number;
  picture: string;
  gmail: string;
  fullName: string;
  birthday: string;
  gender: string;
  role: string;
}

export default function AdminProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params?.id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
    const [adminData, setadminData] = useState({
      roles: "",
      id: ""
    });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/admin/${userId}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });
        const result = await response.json();

        if (response.ok && result.status === "success") {
          setUser(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

    useEffect(() => {
      const fetchadminData = async () => {
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
            const {roles, id } = result.data;
          
            const roleNameMatch = roles.match(/name=ROLE_(.+)\)/);
            const roleName = roleNameMatch ? roleNameMatch[1] : "Unknown Role";
          
            setadminData({ roles: roleName, id });
          } else {
            console.error("Error in API response:", result.statusMessage);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    
      fetchadminData();
    }, []);

  const handleCardClick = (id: number) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex bg-blue-100 h-screen text-black">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-xl font-bold">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex bg-blue-100 h-screen text-black">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center text-xl font-bold">
          <p>User not found!</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-blue-100 h-screen text-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="text-3xl font-bold mb-6">ADMIN PROFILE</div>
        <div className="flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-[90%] h-[90%] flex-col">
            <div className="flex items-start mb-6">
            <div className="flex-shrink-0 mr-6">
              <img
                src={user.picture}
                alt="Admin"
                width={120}
                height={120}
                className="rounded-full border-2 border-blue-500"
              />
            </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.fullName || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Birthday</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.birthday || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.gender || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.gmail || "Not Available"}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <p className="w-full border border-gray-300 rounded-md px-4 py-2">
                    {user.role || "Not Available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right space-x-4">
              <button
                onClick={handleCancel}
                className="mt-10 py-2 px-6 text-sm text-white bg-gray-500 hover:bg-gray-700 rounded-lg"
              >
                Back
              </button>
              {adminData.roles === "master Admin" || Number(adminData.id) === user.id ? (
                <button
                  onClick={() => handleCardClick(user.id)}
                  className="mt-10 py-2 px-6 text-sm text-white bg-blue-500 hover:bg-blue-700 rounded-lg"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
