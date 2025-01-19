const caturl =
  "https://th.bing.com/th/id/OIP.54-OfDJtPnzc8FPVj0lFQgHaE7?rs=1&pid=ImgDetMain";
import { caseAll } from "@/app/api/case/all/route";
import axios from "axios";
import Link from "next/link";

const CaseBox = async () => {
  const response = await caseAll();
  const cases = response[0].data;
  // console.log(cases);

  return (
    <>
      <div className="h-full overflow-y-auto mt-[2vh] pb-[4vh]">
        <div className="w-full flex flex-col justify-center items-center ">
          {cases.map((item, index) => (
            <Link key={index} href={`/case/${item.case_id}`} passHref
            className="">
              <div className="w-full">
                <div
                  key={item.case_id}
                  className="grid grid-cols-6 gap-6 items-center h-[16vh] w-[70vw] mb-[3vh] bg-gray-200 border-white border-4 rounded-xl text-black text-base
                  hover:border-blue-600 hover:bg-white active:border-blue-900"
                >
                  <div className="ml-[3vw] ">
                    <img
                      // src={item.picture}
                      src={caturl}
                      alt="case pic"
                      height={120}
                      width={120}
                    />
                  </div>
                  <p className="text-center">{item.case_id}</p>
                  <p className="">{item.category}</p>
                  <p className="">{item.damage_value}</p>
                  <p className="">{new Date(item.date_opened).toLocaleDateString('en-GB')}</p>
                  <p className="pl-[2vw]">{item.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
export default CaseBox;
