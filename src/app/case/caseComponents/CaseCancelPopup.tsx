import React from "react";

interface PopupProps {
  message: string;
  onSubmit: () => void;
  onCancel: () => void;
  detailCancel: string
  setDetailCancel:React.Dispatch<React.SetStateAction<string>>;
}

const CancelPopup: React.FC<PopupProps> = ({
  message,
  onSubmit,
  onCancel,
  detailCancel,
  setDetailCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center w-80 shadow-lg">
        <p>{message}</p>
        <form>
          <textarea
            id="CancelDetailBox"
            className="my-[2vh] px-[1vw] py-[.5vh] w-full h-[20vh] text-wrap border-black border-2"
            placeholder="Detail.."
            value={detailCancel}
            onChange={(e) => setDetailCancel(e.target.value)}
          ></textarea>
        </form>
        <div className="flex justify-around mt-5">
          <button
          id="SubmitCancel btn"
            onClick={onSubmit}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
          >
            Submit
          </button>
          <button
          id="RevokeCancel btn"
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
