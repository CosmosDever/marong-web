import CaseBox from "../component/CaseBox";
import Searchbar from "../component/Searchbar";
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
            <div className="ml-[5vw] h-[3vh flex w-full text-sm font-bold">
              <p className="ml-[6vw]">Picture</p>
              <p className="ml-[12vw]">ID</p>
              <p className="ml-[9.5vw]">Type</p>
              {/* <p className="">Detail</p> */}
              <p className="ml-[10vw]">Date</p>
              <p className="ml-[14vw]">Status</p>
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
