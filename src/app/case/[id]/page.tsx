import Sidebar from "@/app/component/Sidebar";
import Image from "next/image";
import CaseControl from "../caseComponents/CaseControl";

const detail = async ({ params }:{params:any}) => {
  const { id } = await params;
  console.log(id);
  return (
    <>
      <div className="flex min-h-screen overflow-x-hidden overflow-y-hidden ">
        <Sidebar />
        <div className="pl-[3vw] pd-[4vh]">
          {/* Title */}
          <div>
            <h1 className="pt-[4vh] text-2xl font-semibold">ID: {id}</h1>
            <h1 className="pt-[1vh] text-xl font-semibold">Status:</h1>
          </div>
          {/* Picture */}
          <div className="flex mt-[4vh] gap-6">
            <Image src="/case1.png" alt="Case1 pic" width={400} height={400} />
            <Image
              src="/newsimage.png"
              alt="Case2 pic"
              width={400}
              height={400}
            />
          </div>
          {/* Detail */}
          <div className="mt-[3vh]">
            <h1 className="font-semibold">Detail:</h1>
            <p className="w-10/12 ">
              Lorem ipsum dolor sit amet consectetur adipiscing elit maecenas
              quisque tempor, tristique nisi class hac condimentum risus magna
              et donec vehicula, tempus aptent sem augue semper lacus hendrerit
              bibendum odio.Lorem ipsum dolor sit amet consectetur adipiscing
              elit maecenas quisque tempor, tristique nisi class hac condimentum
              risus magna et donec vehicula, tempus aptent sem augue semper
              lacus hendrerit bibendum odio.
            </p>
            {/* Location */}
            <div className="w-[50vw] flex mt-[3vh] ml-[2vw]">
              <Image src="/map.png" alt="Map pic" width={200} height={200} />
              <div className="flex flex-col ml-[2vw]">
                <h1 className="font-semibold">Location:</h1>
                <p className="">
                  126 Pracha Uthit Rd, Bang Mot, Thung Khru, Bangkok 10140
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
