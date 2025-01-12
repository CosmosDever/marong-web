import CaseControl from "@/app/component/CaseControl";
import Sidebar from "@/app/component/Sidebar";
import Image from "next/image";

const detail = () => {
  return (
    <>
      <div className="flex h-[100vh] ">
        <Sidebar />
        <div className="ml-[2vw]">
          {/* Title */}
          <div>
            <h1>ID:</h1>
            <h1>Status:</h1>
          </div>
          {/* Picture */}
          <div className="flex">
            <Image src="/case1.png" alt="Case1 pic" width={400} height={400} />
            <Image
              src="/newsimage.png"
              alt="Case2 pic"
              width={400}
              height={400}
            />
          </div>
          {/* Detail */}
          <div>
            <h1>Detail:</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipiscing elit maecenas
              quisque tempor, tristique nisi class hac condimentum risus magna
              et donec vehicula, tempus aptent sem augue semper lacus hendrerit
              bibendum odio.
            </p>
            {/* Location */}
            <div className="flex"> 
              <Image src="/map.png" alt="Map pic" width={200} height={200} />
            <div>
            <h1>Location:</h1>
            <p>126 Pracha Uthit Rd, Bang Mot, Thung Khru, Bangkok 10140</p>
            </div>
            </div>
          </div>
          {/* Control btn */}
          <CaseControl/>
        </div>
      </div>
    </>
  );
};
export default detail;
