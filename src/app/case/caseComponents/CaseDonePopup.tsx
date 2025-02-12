import { uploadImage } from "@/app/component/imageUpload";
import React from "react";
interface PopupProps {
  message: string;
  onSubmit: () => void;
  onCancel: () => void;
  detailDone: string;
  setDetailDone: React.Dispatch<React.SetStateAction<string>>;
  imageDone: string;
  setImageDone: React.Dispatch<React.SetStateAction<string>>;
}

const DonePopup: React.FC<PopupProps> = ({
  message,
  onSubmit,
  onCancel,
  detailDone,
  setDetailDone,
  imageDone,
  setImageDone,
}) => {
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file); 
        setImageDone(url); 
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="max-h fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="overflow-auto h-[80vh] bg-white p-6 rounded-lg text-center w-80 shadow-lg">
        <p>{message}</p>
        <form>
          <textarea
          id="DoneDetailBox"
            className="my-[2vh] px-[1vw] py-[.5vh] w-full h-[20vh] text-wrap border-black border-2"
            placeholder="Please insert detail"
            value={detailDone}
            onChange={(e) => setDetailDone(e.target.value)}
          ></textarea>
          <input id="DonePictureBox" type="file" accept="image/*" onChange={handleImageChange} />
        </form>
        {imageDone && (
          <img
            src={imageDone}
            alt="ImageDone"
            className="mt-[2vh]"
          />
        )}
        <div className="flex justify-around mt-5">
          <button
          id="RevokeDone btn"
            onClick={onCancel}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
            type="submit"
          >
            Cancel
          </button>
          <button
          id="SubmitDone btn"
            onClick={onSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:opacity-80"
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonePopup;
