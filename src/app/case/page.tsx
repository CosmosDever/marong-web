import CaseBox from "./caseComponents/CaseBox";
import Searchbar from "./caseComponents/Searchbar";
import Sidebar from "../component/Sidebar";

const casePage = () => {
  return (
    <>
      <div className="flex min-h-screen overflow-x-hidden overflow-y-hidden">
        <Sidebar />
        {/* Head */}
        <div className="h-full w-[83vw]">
          {/* Head */}
          <div className="h-[20vh] w-full">
            <h1 className="pt-[4vh] pl-[8vw] text-3xl font-bold">CASE</h1>
            <div className="flex justify-end pr-[4vw]">
              <Searchbar />
            </div>
          </div>
          {/* Body */}
          <div className="h-[80vh] w-full">
            {/* label */}
            <div className="pl-[10vw] pr-[15vw] grid grid-cols-5 gap-x-10 h-[3vh] w-full text-sm font-bold">
              <p className="">Picture</p>
              <p className="pl-[3vw]">ID</p>
              <p className="">Type</p>
              {/* <p className="">Detail</p> */}
              <p className="pl-[2vw]">Date</p>
              <p className="pl-[8vw]">Status</p>
            </div>
            {/* box */}
            <div className="h-full w-full bg-[#dee3f6] border-body-border border-t-4 rounded ">
              <CaseBox />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default casePage;
