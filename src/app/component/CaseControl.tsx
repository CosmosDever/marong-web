const CaseControl = () => {
  return (
    <>
      <div className="w-[20vw] h-[12vh] fixed bottom-10 right-7 flex justify-evenly items-center bg-lightblue-bg rounded-xl">
        <div>
          <button className="w-[8vw] border-black border-2 rounded-xl bg-red-500 text-white">Cancel operation</button>
        </div>
        <div>
          <button className="w-[8vw] border-black border-2 rounded-xl bg-blue-500 text-white">Mark as In progress</button>
        </div>
      </div>
    </>
  );
};

export default CaseControl;
