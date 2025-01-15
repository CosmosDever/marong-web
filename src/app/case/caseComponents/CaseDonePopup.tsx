import React from "react";
interface PopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  detail2: string;
  setDetail2: React.Dispatch<React.SetStateAction<string>>;
  imageDone: string | null;
  setImageDone: React.Dispatch<React.SetStateAction<string | null>>;
}

const DonePopup: React.FC<PopupProps> = ({
  message,
  onConfirm,
  onCancel,
  detail2,
  setDetail2,
  imageDone,
  setImageDone,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDone(reader.result as string); // แปลงรูปเป็น base64
      };
      reader.readAsDataURL(file); // อ่านไฟล์
    }
  };

  return (
    <div className="max-h fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-center w-80 shadow-lg">
        <p>{message}</p>
        <form>
          <textarea
            className="my-[2vh] px-[1vw] py-[.5vh] w-full h-[20vh] text-wrap border-black border-2"
            placeholder="Detail..."
            value={detail2}
            onChange={(e) => setDetail2(e.target.value)}
          ></textarea>
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
            onClick={onCancel}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
            type="submit"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:opacity-80"
            type="submit"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonePopup;
