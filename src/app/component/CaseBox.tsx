import Image from "next/image";
import Link from "next/link";

const CaseBox = () => {
  const cases = Array(15)
    .fill(null)
    .map((_, index) => `${index + 1}`);
  return (
    <>
      <div className="h-full overflow-y-auto mt-[2vh] pb-[4vh]">
        <div className="w-full flex flex-col justify-center items-center">
          {cases.map((caseId) => (
            <Link key={caseId} href={`/case/${caseId}`} passHref>
              <div className="w-full">
                <div
                  key={caseId}
                  className="flex justify-stretch items-center h-[16vh] w-[70vw] mb-[3vh] bg-gray-200 border-white border-4 rounded-xl text-black text-base"
                >
                  <div className="ml-[3vw]">
                    <img
                      src="/case1.png"
                      alt="case1 pic"
                      height={120}
                      width={120}
                    />
                  </div>
                  <p className="ml-[8vw]">{caseId}</p>
                  <p className="ml-[10vw]">Type</p>
                  <p className="ml-[10vw]">12/01/2025</p>
                  <p className="ml-[10vw]">Status</p>
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
