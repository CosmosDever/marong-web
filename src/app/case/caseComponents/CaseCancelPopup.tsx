import React from "react";

interface PopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelPopup: React.FC<PopupProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center w-80 shadow-lg">
        <p>{message}</p>
        <form>
          <textarea
            className="my-[2vh] px-[1vw] py-[.5vh] w-full h-[20vh] text-wrap border-black border-2"
            placeholder="Detail..."
            
          ></textarea>
        </form>
        <div className="flex justify-around mt-5">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-white-500 text-black rounded-lg hover:opacity-80"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPopup;
