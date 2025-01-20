"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface ApiResponse {
  message: {
    token: string[];
  };
}

interface CaseData {
  caseId: number;
  category: string;
  detail: string;
  picture: string;
  location: LocationData;
  dateOpened: string;
  dateClosed: string | null;
  reportStatus: string;
  damage_value: string;
}

interface LocationData {
  coordinates: [string, string];
  description: string | null;
}

const API_BASE_URL = "http://localhost:8080/api";

const CaseBox: React.FC = () => {
  const [cases, setCases] = useState<CaseData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loginAndFetchToken = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/auth/login`,
        {
          gmail: "msaidmin@gmail.com",
          password: "hashed_password_2",
        }
      );

      const authToken = response.data.message.token[0];
      localStorage.setItem("token", authToken);
      setToken(authToken);
      return authToken;
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check credentials and try again.");
      return null; 
    }
  };

  const fetchCases = async (authToken: string) => {
    try {
      const response = await axios.get<{ data: CaseData[] }>(
        `${API_BASE_URL}/case/all`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setCases(response.data.data);
    } catch (err) {
      setError("Failed to fetch cases. Ensure token is valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const init = async () => {

      const authToken = await loginAndFetchToken();

      if (authToken) {
        fetchCases(authToken);
      } else {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="h-full overflow-y-auto mt-[2vh] pb-[4vh]">
        <div className="w-full flex flex-col justify-center items-center ">
          {cases?.map((item) => (
            <Link
              key={item.caseId}
              href={`/case/${item.caseId}`}
              passHref
              className=""
            >
              <div className="w-full">
                <div
                  key={item.caseId}
                  className="grid grid-cols-6 gap-6 items-center h-[16vh] w-[70vw] mb-[3vh] bg-gray-200 border-white border-4 rounded-xl text-black text-base
                  hover:border-blue-600 hover:bg-white active:border-blue-900"
                >
                  <div className="ml-[3vw] ">
                    <img
                      src={item.picture}
                      alt="case pic"
                      height={120}
                      width={120}
                    />
                  </div>
                  <p className="text-center">{item.caseId}</p>
                  <p className="">{item.category}</p>
                  <p className="">{item.damage_value}</p>
                  <p className="">
                    {new Date(item.dateOpened).toLocaleDateString("en-GB")}
                  </p>
                  <p className="pl-[2vw]">{item.reportStatus}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default CaseBox;
