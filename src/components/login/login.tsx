import SignIn from "./components/signIn";

export default function Login() {
  return (
    <div className="flex justify-center">
      <div className="flex justify-center items-center bg-[white] md:w-[40%] lg:w-[25%] xl:w-[25%] absolute 2xl:w-[25%] mt-40 pt-4 pb-4 shadow rounded-xl">
        <SignIn />
      </div>
    </div>
  );
}
