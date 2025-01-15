const caturl =
  "https://th.bing.com/th/id/OIP.54-OfDJtPnzc8FPVj0lFQgHaE7?rs=1&pid=ImgDetMain";
import CaseControl from "../caseComponents/CaseControl";
import Sidebar from "@/app/component/sidebar";
import { caseId } from "@/app/api/case/route";

const detail = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const res = await caseId();
  const caseData = res[0].data;

  console.log(id);
  console.log(caseData);

  if (caseData.case_id !== id) {
    return <p className="m-[4vw] ">Case not found for ID: {id}</p>;
  }

  return (
    <>
      <div className="flex min-h-screen overflow-x-hidden overflow-y-hidden ">
        <Sidebar />
        <div className="pl-[3vw] pb-[6vh]">
          {/* Title */}
          <div>
            <h1 className="pt-[4vh] text-2xl font-bold">
              ID: {caseData.case_id}
            </h1>
            <h1 className="pt-[1vh] text-xl font-semibold">
              Status: {caseData.status}
            </h1>
            <h1 className="pt-[1vh] text-lg font-semibold">
              Category: {caseData.category}
            </h1>
            <div>
              <h1 className="absolute right-[3vw] top-[1vh] pt-[1vh] text-base font-thin">
                Reported by: {caseData.user.full_name} #{caseData.user.user_id}
              </h1>
            </div>
          </div>
          {/* Picture */}
          <div className="flex mt-[4vh] gap-6">
            <img
              // src={caseData.picture}
              src={caturl}
              alt="Case1 pic"
              width={400}
              height={400}
            />
            <img
              // src= {caseData.picture_done}
              src={caturl}
              alt="Case2 pic"
              width={400}
              height={400}
            />
          </div>
          {/* Damage value */}
          <div className="mt-[3vh]">
            <h1 className="font-semibold">
              Damage value: {caseData.damage_value}
            </h1>
          </div>
          {/* Detail */}
          <div className="mt-[3vh]">
            <h1 className="font-semibold">Detail:</h1>
            <p className="w-10/12 ">{caseData.detail}</p>
            {/* Location */}
            <div className="w-[50vw] flex mt-[3vh] ml-[2vw]">
              <img src="/map.png" alt="Map pic" width={200} height={200} />
              <div className="flex flex-col ml-[2vw]">
                <h1 className="font-semibold">Location:</h1>
                <p className="">
                  {caseData.location.description}
                  {/* {caseData.location.coordinates} */}
                </p>
              </div>
            </div>
          </div>
          {/* Control btn */}
          <CaseControl />
        </div>
      </div>
    </>
  );
};
export default detail;
