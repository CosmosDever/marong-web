import Image from "next/image";

const BoxCase = () => {
  const cases = Array(10)
    .fill(null)
    .map((_, index) => `case-${index + 1}`);
  return (
    <>
      <div className="h-full overflow-y-auto mt-[2vh]">
        <div className="flex flex-col justify-center items-center">
          {cases.map((caseId) => (
            <div key={caseId} className="h-[12vh] w-10/12 mb-[3vh] bg-blue-300">
              <p>{caseId}</p>
              <a href="/case/detail" className="text-blue-600 hover:underline">
                <Image
                  src="/editbutton.png"
                  alt="Edit Button"
                  width={25}
                  height={25}
                  className="inline-block"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default BoxCase;
