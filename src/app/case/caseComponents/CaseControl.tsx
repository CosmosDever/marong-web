"use client";

import { useState } from "react";
import CancelPopup from "./CaseCancelPopup";
import InProgressPopup from "./CaseInProgressPopup";
import { NextResponse } from "next/server";
import detail from "../[id]/page";
import DonePopup from "./CaseDonePopup";

export async function postInProgress(detail: string) {
  // console.log("Request body received:", { detail });

  if (!detail) {
    const response = {
      status: "error",
      message: "'detail' are required when changing status to 'in progress'.",
    };

    console.log("Response:", response);

    return NextResponse.json(response);
  }

  if (detail) {
    const response = {
      status: "success",
      message: "Case status updated successfully.",
      data: {
        case_id: "101",
        status: "In Progress",
        detail: detail,
        date_updated: "2024-12-22T10:30:00Z",
      },
    };

    console.log("Response:", response);

    return NextResponse.json(response);
  }

  console.log("Error: Invalid status or missing detail");
  return NextResponse.json(
    { message: "Invalid status or missing detail" },
    { status: 400 }
  );
}

export async function postDone(detail2: string) {
  // console.log("Request body received:", { detail2 });
  if (!detail2) {
    const response = {
      status: "error",
      message:
        "Both 'detail' and 'picture' are required when changing status to 'Done'.",
    };
    console.log("Response:", response);

    return NextResponse.json(response);
  }

  if (detail2) {
    const response = {
      status: "success",
      message: "Case status updated to 'Done' successfully.",
      data: {
        case_id: "101",
        status: "Done",
        detail: detail2,
        picture: "https://example.com/images/road-repair-done.jpg",
        date_updated: "2024-12-22T10:30:00Z",
      },
    };

    console.log("Response:", response);

    return NextResponse.json(response);
  }

  console.log("Error: Invalid status or missing detail");
  return NextResponse.json(
    { message: "Invalid status or missing detail" },
    { status: 400 }
  );
}

const CaseControl = () => {
  const [isInProgressBtnVisible, setIsInProgressBtnVisible] = useState(true);
  const [isDoneBtnVisible, setIsDoneBtnVisible] = useState(false);
  const [isCancelPopupVisible, setIsCancelPopupVisible] = useState(false);
  const [isInProgressPopupVisible, setIsInProgressPopupVisible] =
    useState(false);
  const [isDonePopupVisible, setIsDonePopupVisible] = useState(false);
  const [detail, setDetail] = useState(
    "กำลังส่งเรื่องให้หน่วยงานที่เกี่ยวข้องเพื่อทำการแก้ไขครับ"
  );
  const [detail2, setDetail2] = useState("ได้รับการแก้ไขโดยการซ่อมเรียบร้อย");

  const togglePopup = (type: "cancel" | "inProgress" | "done") => {
    if (type === "cancel") {
      setIsCancelPopupVisible((prev) => !prev);
    } else if (type === "inProgress") {
      setIsInProgressPopupVisible((prev) => !prev);
    } else if (type === "done") {
      setIsDonePopupVisible((prev) => !prev);
    }
  };

  const handleConfirm = async (type: "cancel" | "inProgress" | "done") => {
    if (type === "cancel") {
      console.log(`Cancel Confirmed!`);
      setIsCancelPopupVisible(false);
    } else if (type === "inProgress") {
      try {
        const response = await postInProgress(detail);
        if (response && detail) {
          // console.log("InProgress pressed");
          // console.log(detail);
          setIsInProgressPopupVisible(false);
          setIsInProgressBtnVisible(false);
          setIsDoneBtnVisible(true);
        } else {
          console.error("Failed to update case status.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else if (type === "done") {
      try {
        const response = await postDone(detail2);

        if (response && detail2) {
          // console.log("Done pressed");
          // console.log(detail2);
          setIsDonePopupVisible(false);
        } else {
          console.error("Failed to update case status.");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
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
      <div className="z-10 w-[20vw] h-[12vh] fixed bottom-10 right-7 flex justify-evenly items-center bg-lightblue-bg rounded-xl">
        <button
          onClick={() => togglePopup("cancel")}
          className="w-[8vw] border-black border-2 rounded-xl bg-red-500 text-white hover:bg-red-600 active:bg-red-800"
        >
          Cancel operation
        </button>
        {isInProgressBtnVisible && (
          <button
            onClick={() => togglePopup("inProgress")}
            className="w-[8vw] h-[8vh] border-black border-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-800"
          >
            Mark as In progress
          </button>
        )}
        {isDoneBtnVisible && (
          <button
            onClick={() => togglePopup("done")}
            className="w-[8vw] h-[8vh] border-black border-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900"
          >
            Mark as Done
          </button>
        )}
      </div>
      {isCancelPopupVisible && (
        <CancelPopup
          message="Are you sure you want to cancel?"
          onConfirm={() => handleConfirm("cancel")}
          onCancel={handleCancel}
        />
      )}
      {isInProgressPopupVisible && (
        <InProgressPopup
          message="Are you sure you want to change status to In progress?"
          onConfirm={() => handleConfirm("inProgress")}
          onCancel={handleCancel}
          detail={detail}
          setDetail={setDetail}
        />
      )}
      {isDonePopupVisible && (
        <DonePopup
          message="Are you sure you want to change status to Done?"
          onConfirm={() => handleConfirm("done")}
          onCancel={handleCancel}
          detail2={detail2}
          setDetail2={setDetail2}
        />
      )}
    </>
  );
};

export default CaseControl;
