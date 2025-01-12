import BoxCase from "../component/CaseBox";
import Searchbar from "../component/Searchbar";
import Sidebar from "../component/Sidebar";

const casePage = () => {
  return (
    <>
      <div className="flex h-[100vh] ">
        <Sidebar />
        {/* Head */}
        <div className="h-full w-full">
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
            <div className="h-[3vh flex w-full text-sm font-bold">
              <p className="pl-[5vw]">Picture</p>
              <p className="pl-[5vw]">ID</p>
              <p className="pl-[5vw]">Type</p>
              <p className="pl-[5vw]">Detail</p>
              <p className="pl-[5vw]">Date</p>
              <p className="pl-[5vw]">Status</p>
            </div>
            {/* box */}
            <div className="h-[77vh] bg-[#dee3f6] border-body-border border-t-4 rounded ">
              <BoxCase/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default casePage;
