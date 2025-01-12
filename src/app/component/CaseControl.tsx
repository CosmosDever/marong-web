"use client";

import { useState } from "react";
import CancelPopup from "./CaseCancelPopup";
import InProgressPopup from "./CaseInProgressPopup";

const CaseControl = () => {
  const [isCancelPopupVisible, setIsCancelPopupVisible] =
    useState<boolean>(false);
  const [isInProgressPopupVisible, setIsInProgressPopupVisible] =
    useState<boolean>(false);

  const handleCancelPopupToggle = () => {
    setIsCancelPopupVisible(!isCancelPopupVisible);
  };
  const handleInProgressPopupToggle = () => {
    setIsInProgressPopupVisible(!isInProgressPopupVisible);
  };

  const handleCancelConfirm = () => {
    console.log("Confirmed!");
    setIsCancelPopupVisible(false);
  };

  const handleInProgressConfirm = () => {
    console.log("Confirmed!");
    setIsInProgressPopupVisible(false);
  };

  const handleCancel = () => {
    console.log("Cancelled!");
    setIsCancelPopupVisible(false);
    setIsInProgressPopupVisible(false);
  };

  return (
    <>
      <div className="w-[20vw] h-[12vh] fixed bottom-10 right-7 flex justify-evenly items-center bg-lightblue-bg rounded-xl">
        <div>
          <button
            onClick={handleCancelPopupToggle}
            className="w-[8vw] border-black border-2 rounded-xl bg-red-500 text-white"
          >
            Cancel operation
          </button>
        </div>
        <div>
          <button
            onClick={handleInProgressPopupToggle}
            className="w-[8vw] border-black border-2 rounded-xl bg-blue-500 text-white"
          >
            Mark as In progress
          </button>
        </div>
      </div>
      {isCancelPopupVisible && (
        <CancelPopup
          message={`Are you sure you want to cancel?`}
          onConfirm={handleCancelConfirm}
          onCancel={handleCancel}
        />
      )}
      {isInProgressPopupVisible && (
        <InProgressPopup
          message={`Are you sure you want to change status to In progress?`}
          onConfirm={handleInProgressConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default CaseControl;
