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
        <div className="absolute right-[3vw] top-[5vh] w-[22vw] max-w-full bg-blue-950 rounded-2xl shadow-xl overflow-hidden">
          {/* Map Image */}
          <div className="w-full h-[15vw]">
            <MapBox
              coordinates={[
                parseFloat(cases?.[0]?.location.coordinates[1] || "0"),
                parseFloat(cases?.[0]?.location.coordinates[0] || "0"),
              ]}
            />
          </div>

          {/* Text Section */}
          <div className="p-[1vw] flex flex-col my-[1vh] h-full text-white text-wrap break-words overflow-y-hidden ">
            <h1 className="font-semibold text-white">
              Location :{" "}
              <span className="font-normal text-white">
                {cases?.[0]?.location.description || "No information"}
              </span>
            </h1>
          </div>
        </div>

        <div className="w-full ml-[3vw] ">
          {/* Picture */}
          <div className=" flex mt-[4vh] gap-3 ">
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

          {/* Box */}
          <div className=" pb-[2vh] pt-[1vh] ml-[4vw] mt-[3vh] w-[51vw] max-h-full text-wrap break-words justify-center border bg-blue-200 rounded-[1.7rem] shadow-[2px_0_4px_rgba(0,0,0,0.3)] ">
            <div className=" mt-[1vh] ml-[1vw] px-[2vw] pb-[1vh] w-[49vw] rounded-xl flex flex-row bg-white border">
              <h1 className="pt-[1vh] text-2xl font-bold w-[9vw]">
                ID : <span className="font-normal">{cases?.[0]?.caseId}</span>
              </h1>

              <h1 className="pt-[1vh] text-xl font-bold w-[13vw]">
                Status :{" "}
                <span
                  className={`font-normal ${
                    cases?.[0]?.status === "InProgress"
                      ? "text-[#ff8000]"
                      : cases?.[0]?.status === "Waiting"
                      ? "text-[#e40513]"
                      : cases?.[0]?.status === "Done"
                      ? "text-[#247d26]"
                      : cases?.[0]?.status === "Cancel"
                      ? "text-#e40513]"
                      : "text-black"
                  }`}
                >
                  {cases?.[0]?.status}
                </span>
              </h1>
              <h1 className="pt-[1vh] text-lg font-bold w-[18vw]">
                Category :{" "}
                <span className="font-normal">{cases?.[0]?.category}</span>
              </h1>
            </div>

            <div className="flex ">
              {/* Damage value */}
              <div className="max-w-[12vw] h-[10vh] mt-[2vh] ml-[1vw] pt-[1vh] px-[2vw] pb-[1vh] w-[49vw] rounded-xl bg-white border">
                <h1 className="font-semibold">
                  Damage value :
                  <span className="font-light">
                    {" "}
                    {cases?.[0]?.damage_value}
                  </span>
                </h1>
              </div>

              {/* Detail */}
              <div className="w-[36vw] h-[10vh] mt-[2vh] ml-[1vw] pt-[1vh] px-[2vw] pb-[1vh] rounded-xl bg-white border">
                <h1 className="font-semibold">Detail:</h1>
                <p className="w-full">{cases?.[0]?.detail}</p>
              </div>
            </div>

            {/* Control btn */}
            <CaseControl />
          </div>
          {/* Report by ID */}
          <h1 className="pt-[1vh] pl-[14vw] text-base font-thin basis-1/3 justify-end text-center ">
            Reported by: {cases?.[0]?.user.full_name} #
            {cases?.[0]?.user.user_id}
          </h1>
        </div>
      </div>
    </>
  );
};

export default CaseById;
