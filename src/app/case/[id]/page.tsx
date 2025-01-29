"use client";

import CaseControl from "../caseComponents/CaseControl";
import Sidebar from "@/app/component/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import MapBox from "../caseComponents/MapBox";

interface ApiResponse {
  message: {
    token: string[];
  };
}

interface CaseData {
  caseId: string | number;
  category: string;
  detail: string;
  location: LocationData;
  damage_value: string;
  status: string;
  date_opened: string;
  date_closed: string | null;
  picture: string;
  picture_done: string;
  reportStatus: string;
  user: User;
}

interface LocationData {
  coordinates: [string, string];
  description: string | null;
}

interface User {
  user_id: string;
  full_name: string;
  gmail: string;
  picture: string;
}

const API_BASE_URL = "http://localhost:8080/api";

const CaseById: React.FC = () => {
  const params = useParams();
  // console.log("params : ",params);
  const { id } = params;
  // console.log("id : ",id);

  const [cases, setCases] = useState<CaseData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(( ) => {
    const token = localStorage.getItem("token")
    const fetchCases = async () => {
      if (!token) return;
      try {
        const response = await axios.get<{ data: CaseData }>(
          `${API_BASE_URL}/case/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCases([response.data.data]);
      } catch (err) {
        setError("Failed to fetch cases. Ensure token is valid.");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="flex min-h-screen overflow-x-hidden overflow-y-hidden pb-[4vh]">
        <Sidebar />
        <div>
          <div className="pl-[3vw] pb-[6vh]">
            <h1 className="pt-[4vh] text-2xl font-bold">
              ID: {cases?.[0]?.caseId}
            </h1>
            <h1 className="pt-[1vh] text-xl font-semibold">
              Status: {cases?.[0]?.status}
            </h1>
            <h1 className="pt-[1vh] text-lg font-semibold">
              Category: {cases?.[0]?.category}
            </h1>
            <div>
              <h1 className="absolute right-[3vw] top-[1vh] pt-[1vh] text-base font-thin">
                Reported by: {cases?.[0]?.user.full_name} #
                {cases?.[0]?.user.user_id}
              </h1>
            </div>

            {/* Picture */}
            <div className="flex mt-[4vh] gap-6">
              <img
                src={cases?.[0]?.picture}
                alt="Case1 pic"
                width={400}
                height={400}
              />
              {cases?.[0]?.picture_done && (
                <img
                  src={cases?.[0]?.picture_done}
                  alt=""
                  width={400}
                  height={400}
                />
              )}
            </div>

            {/* Damage value */}
            <div className="mt-[3vh]">
              <h1 className="font-semibold">
                Damage value: {cases?.[0]?.damage_value}
              </h1>
            </div>

            {/* Detail */}
            <div className="mt-[3vh]">
              <h1 className="font-semibold">Detail:</h1>
              <p className="w-10/12">{cases?.[0]?.detail}</p>

              {/* Location */}
              <div className="relative w-[50vw] h-full flex mt-[3vh] ml-[2vw] overflow-y-hidden">
                <div className="flex w-[20vw] h-[20vw]">
                  <MapBox
                    coordinates={[
                      // MOCK
                      parseFloat(cases?.[0]?.location.coordinates[1] || "0"),
                      parseFloat(cases?.[0]?.location.coordinates[0] || "0"),
                    ]}
                  />
                </div>
                <div className="flex flex-col ml-[2vw]">
                  <h1 className="font-semibold">Location:</h1>
                  <p>
                    {cases && cases[0] && cases[0].location.description === null
                      ? "No information"
                      : cases?.[0].location.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Control btn */}
            <CaseControl />
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseById;
