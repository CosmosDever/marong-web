"use client";

import { useEffect, useState } from "react";
import CancelPopup from "./CaseCancelPopup";
import { NextResponse } from "next/server";
import axios from "axios";
import { useParams } from "next/navigation";
import InProgressPopup from "./CaseInProgressPopup";
import DonePopup from "./CaseDonePopup";
import { useRouter } from "next/navigation";

export async function updateCancel(detailCancel: string, id: string) {
  if (!detailCancel) {
    const response = {
      status: "error",
      message: "'Detail' is required when cancelling the case.",
    };

    alert("'Detail' is required when cancelling the case.");

    return NextResponse.json(response);
  }

  if (detailCancel) {
    const response = {
      status: "success",
      message: "Case status updated to 'Cancelled' successfully.",
      data: {
        case_id: id,
        status: "Cancelled",
        detail: detailCancel,
        date_updated: new Date().toISOString(),
      },
    };
    // console.log("Cancel Response:", response);

    return NextResponse.json(response);
  }

  console.log("Error: Invalid status or missing detail");
  return NextResponse.json(
    { message: "Invalid status or missing detail" },
    { status: 400 }
  );
}

export async function postInProgress(detail: string, id: string) {
  // console.log("Request body received:", { detail });

  if (!detail) {
    const response = {
      status: "error",
      message: "'Detail' are required when changing status to 'in progress'.",
    };

    alert("'Detail' are required when changing status to 'in progress'");

    return NextResponse.json(response);
  }

  if (detail) {
    const response = {
      status: "success",
      message: "Case status updated successfully.",
      data: {
        case_id: id,
        status: "In Progress",
        detail: detail,
        date_updated: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  }

  console.log("Error: Invalid status or missing detail");
  return NextResponse.json(
    { message: "Invalid status or missing detail" },
    { status: 400 }
  );
}

export async function postDone(
  detailDone: string,
  imageDone: string | null,
  id: string
) {
  // console.log("Request body received:", { detaiDone });
  if (!detailDone || !imageDone) {
    const response = {
      status: "error",
      message:
        "Both 'detail' and 'picture' are required when changing status to 'Done'.",
    };

    alert(
      "Both 'detail' and 'picture' are required when changing status to 'Done'."
    );

    return NextResponse.json(response);
  }

  if (detailDone && imageDone) {
    const response = {
      status: "success",
      message: "Case status updated to 'Done' successfully.",
      data: {
        case_id: id,
        status: "Done",
        detail: detailDone,
        picture: imageDone,
        date_updated: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  }

  console.log("Error: Invalid status or missing detail");
  return NextResponse.json(
    { message: "Invalid status or missing detail" },
    { status: 400 }
  );
}

interface ApiResponse {
  message: {
    token: string[];
  };
}

interface CaseData {
  status:string;
}

const API_BASE_URL = "http://localhost:8080/api";

const CaseControl: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);
  const [cases, setCases] = useState<CaseData[] | null>(null);
  const [isInProgressBtnVisible, setIsInProgressBtnVisible] = useState(true);
  const [isDoneBtnVisible, setIsDoneBtnVisible] = useState(false);
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const [isInProgressPopupVisible, setIsInProgressPopupVisible] =
    useState(false);
  const [isDonePopupVisible, setIsDonePopupVisible] = useState(false);
  const [detailInProgress, setDetailInProgress] = useState(String);
  const [detailDone, setDetailDone] = useState(String);
  const [detailCancel, setDetailCancel] = useState(String);
  const [imageDone, setImageDone] = useState(String);
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
        console.log("Error : ",err)
      }
    };

    fetchCases();
  }, [id, token]);

  const handleSubmit = async (type: "cancel" | "inProgress" | "done") => {
    const token = localStorage.getItem("token")
    if (type === "cancel") {
      // CANCEL
      try {
        const response = await updateCancel(detailCancel, id);
        if (response && detailCancel) {
          const post_cancel = async () => {
            if (!token) return;
            try {
              const formData = new FormData();
              formData.append("detail", detailCancel); // Append detail

              const response = await axios.post(
                `${API_BASE_URL}/case/${id}/changeStatus/cancelCase`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log("Cancel updated:", response.data);
              router.back();
            } catch (err) {
              console.error("Error occurred:", err);
            }
          };

          post_cancel();

          // console.log("Cancel updated successfully");
          setIsCancelPopupVisible(false);
        } else {
          console.error("Failed to update case status.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else if (type === "inProgress") {
      // IN PROGRESS
      try {
        const response = await postInProgress(detailInProgress, id);
        if (response && detailInProgress) {
          // POST
          const post_inprogress = async () => {
            if (!token) return;
            try {
              const response = await axios.post(
                `${API_BASE_URL}/case/${id}/changeStatus/inprogress`,
                { detail: detailInProgress },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log("In progress updated:", response.data);
              router.back();
            } catch (err) {
              console.error("Error occurred:", err);
            }
          };

          post_inprogress();
          //POST---

          setIsInProgressPopupVisible(false);

        } else {
          console.error("Failed to update case status.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else if (type === "done") {
      // DONE
      try {
        const response = await postDone(detailDone, imageDone, id);

        if (response && detailDone) {
          const post_done = async () => {
            if (!token) return;
            try {

              const formData = new FormData();
              formData.append("detail", detailDone); // Append detail
              formData.append("picture", imageDone); // Append picture (assuming imageDone is a File or Blob)

              // Send POST request using axios
              const response = await axios.post(
                `${API_BASE_URL}/case/${id}/changeStatus/done`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              console.log("Done updated:", response.data);
              router.back();
            } catch (err) {
              console.error("Error occurred:", err);
            }
          };

          post_done();

          setIsDonePopupVisible(false);
        } else {
          console.error("Failed to update case status.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    }
  };

  const togglePopup = (type: "cancel" | "inProgress" | "done") => {
    if (type === "cancel") {
      setIsCancelPopupVisible((prev) => !prev);
    } else if (type === "inProgress") {
      setIsInProgressPopupVisible((prev) => !prev);
    } else if (type === "done") {
      setIsDonePopupVisible((prev) => !prev);
    }
  };

  const handleCancel = () => {
    console.log("Action Cancelled!");
    setIsCancelPopupVisible(false);
    setIsInProgressPopupVisible(false);
    setIsDonePopupVisible(false);
  };

  return (
    <>
    {cases?.[0]?.status === "Waiting" || cases?.[0]?.status === "InProgress" && (
      <div className="z-10 w-[20vw] h-[12vh] fixed bottom-10 right-7 flex justify-evenly items-center bg-lightblue-bg rounded-xl">
      {/* Cancel operation */}
      
        <button
          onClick={() => togglePopup("cancel")}
          className="w-[8vw] h-[8vh] border-black border-2 rounded-xl bg-red-500 text-white hover:bg-red-600 active:bg-red-800"
        >
          Cancel operation
        </button>
      
        {/* Mark as In progress */}
        {cases?.[0]?.status === "Waiting" && (
          <button
            id="In progress btn"
            onClick={() => togglePopup("inProgress")}
            className="w-[8vw] h-[8vh] border-black border-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-800"
          >
            Mark as In progress
          </button>
        )}
        {/* Mark as Done */}
        {cases?.[0]?.status === "InProgress" && (
          <button
            onClick={() => togglePopup("done")}
            className="w-[8vw] h-[8vh] border-black border-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900"
          >
            Mark as Done
          </button>
        )}
      </div>
)}

      {isCancelPopupVisible && (
        <CancelPopup
          message="Are you sure you want to cancel?"
          onSubmit={() => handleSubmit("cancel")}
          onCancel={handleCancel}
          detailCancel={detailCancel}
          setDetailCancel={setDetailCancel}
        />
      )}
      {isInProgressPopupVisible && (
        <InProgressPopup
          message="Are you sure you want to change status to In progress?"
          onSubmit={() => handleSubmit("inProgress")}
          onCancel={handleCancel}
          detail={detailInProgress}
          setDetail={setDetailInProgress}
        />
      )}
      {isDonePopupVisible && (
        <DonePopup
          message="Are you sure you want to change status to Done?"
          onSubmit={() => handleSubmit("done")}
          onCancel={handleCancel}
          detailDone={detailDone}
          setDetailDone={setDetailDone}
          imageDone={imageDone}
          setImageDone={setImageDone}
        />
      )}
    
    </>
  );
};

export default CaseControl;
