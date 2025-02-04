"use client";

const noImgUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
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
      <div className="flex min-h-screen overflow-x-hidden overflow-y-hidden pb-[4vh] ">
        <Sidebar />

        {/* Location */}
        <div className="absolute right-[3vw] top-[5vh] max-w-[20vw] border-2 border-blue-950 rounded-2xl shadow-xl">
          <div className="relative w-[17vw] h-full flex-1 my-[1vh] mx-[.5vw] px-[1vw] overflow-y-hidden bg-blue-950 rounded-2xl">
            <div className="flex w-[15vw] h-[15vw] mt-[2vh]">
              <MapBox
                coordinates={[
                  // MOCK
                  parseFloat(cases?.[0]?.location.coordinates[1] || "0"),
                  parseFloat(cases?.[0]?.location.coordinates[0] || "0"),
                ]}
              />
            </div>
            <div className="flex flex-col my-[3vh] max-h-full max-w-[15vw] text-white text-wrap break-words">
              <h1 className="font-semibold">Location :</h1>
              <p className="font-normal">
                {cases && cases[0] && cases[0].location.description === null
                  ? "No information"
                  : cases?.[0].location.description}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full ml-[3vw] ">
          {/* Picture */}
          <div className=" flex mt-[4vh] gap-4 ">
            <img
              className="object-cover ml-[4vw] h-[40vh] w-[25vw] rounded-tl-3xl rounded-bl-3xl border"
              src={cases?.[0]?.picture}
              alt="Case pic"
            />

            <img
              className={
                cases?.[0]?.picture_done
                  ? "object-cover ml-[0vw] h-[40vh] w-[25vw] rounded-tr-3xl rounded-br-3xl border"
                  : "object-scale-down ml-[0vw] h-[40vh] w-[25vw] rounded-tr-3xl rounded-br-3xl border"
              }
              src={cases?.[0]?.picture_done || noImgUrl}
              alt="Case done pic"
            />
          </div>

          <div className=" pb-[4vh] pt-[1vh] ml-[3vw] mt-[3vh] w-[54vw] max-h-full text-wrap break-words justify-center border bg-blue-200 rounded-xl shadow-[2px_0_6px_rgba(0,0,0,0.3)] ">
            <div className=" mt-[2vh] mx-[2vw] px-[2vw] pb-[1vh] w-[50vw] rounded-xl flex flex-row flex-wrap bg-white border">
              <h1 className="pt-[1vh] text-2xl font-bold basis-1/3">
                ID : <span className="font-normal">{cases?.[0]?.caseId}</span>
              </h1>

              <h1 className="pt-[1vh] text-xl font-semibold basis-1/3">
                Status :{" "}
                <span className="font-normal">{cases?.[0]?.status}</span>
              </h1>
              <h1 className="pt-[1vh] text-lg font-semibold basis-1/3">
                Category :{" "}
                <span className="font-normal">{cases?.[0]?.category}</span>
              </h1>

              <h1 className="pt-[1vh] text-base font-thin basis-1/3">
                Reported by: {cases?.[0]?.user.full_name} #
                {cases?.[0]?.user.user_id}
              </h1>
            </div>

            <div className=" mt-[2vh] mx-[2vw] px-[2vw] pb-[1vh] w-[50vw] rounded-xl flex-1 flex-wrap bg-white border">
              {/* Damage value */}
              <div className="mt-[1vh]">
                <h1 className="font-semibold">
                  Damage value :
                  <span className="font-light">
                    {" "}
                    {cases?.[0]?.damage_value}
                  </span>
                </h1>
              </div>

              {/* Detail */}
              <div className="mt-[3vh]">
                <h1 className="font-semibold">Detail:</h1>
                <p className="w-10/12">{cases?.[0]?.detail}</p>
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
