export function Loading() {
  return (
    <>
      <div className="w-full flex justify-center items-center mt-[15%]">
        <div
          className=" h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
        </div>
      </div>
    </>
  );
}
