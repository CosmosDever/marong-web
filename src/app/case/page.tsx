import Sidebar from "../component/sidebar";
import CaseBox from "./caseComponents/CaseBox";

const casePage = () => {
  return (
    <>
      <div className="flex max-h-screen overflow-x-hidden overflow-y-hidden">
        <Sidebar />
        {/* Head */}
        <div className="h-full w-[83vw]">
          {/* Head */}
          <div className="h-[20vh] w-full">
            <h1 className="pt-[4vh] pl-[8vw] text-3xl font-bold">CASE</h1>
            {/* Empty Area */}
            <div className="flex justify-end pr-[4vw]">
            </div>
          </div>
          {/* Body */}
          <div className="h-[80vh] w-full">
            {/* label */}

            <div className="ml-[6vw] pr-[15vw] grid grid-cols-6 gap-5 justify-items-center h-[3vh] w-full text-sm font-bold">
              <p className="">Picture</p>
              <p className="pl-[1vw]">ID</p>
              <p className="justify-self-start pl-[1vw]">Type</p>
              <p className=" overflow-visible whitespace-nowrap justify-self-start">
                Damage value
              </p>
              <p className="justify-self-start pl-[3vw]">Date</p>
              <p className="justify-self-start pl-[2vw]">Status</p>
            </div>
            {/* box */}
            <div
              className="h-full w-full bg-[#dee3f6] border-body-border border-t-4 rounded 
            "
            >
              <CaseBox />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default casePage;
