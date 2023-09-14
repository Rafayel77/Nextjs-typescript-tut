import { useState } from "react";
import { FIELDS } from "../../../constants/constants";
import { signUp } from "../../../firebase/auth";
import { Loading } from "../../loading";
import { delayStateChange } from "@/globalFunctions/delayStateChanges";
import Image from "next/image";


interface SignUpPopupProps {
  setIsRegistrationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SignUpPopup({ setIsRegistrationOpen }: SignUpPopupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertSignUp, setAlertSignUp] = useState<string>("");


  const handleSignup = async (email: string, password: string, username: string) => {
    setLoading(true);
    const isSignedUp = await signUp(email, password, username);
    setLoading(false);

    if(isSignedUp === true){
      setAlertSignUp("succesfully created an account !");

      delayStateChange(() => setIsRegistrationOpen(false));

      delayStateChange(() => setAlertSignUp(""));

    } else {
      setAlertSignUp(isSignedUp);

      delayStateChange(() =>setAlertSignUp(""));

    }
  };

  const handleKeyPress = (event: { keyCode: number }) => {
    if (event.keyCode === 13) {
      handleSignup(email, password, username);
    }
  };

  const handleUsernameChange = ({
    target: { value = "" },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(value);
  };

  const handleEmailChange = ({
    target: { value = "" },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
  };

  const handlePasswordChange = ({
    target: { value = "" },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(value);
  };

  const closePopup = () => {
    setIsRegistrationOpen(false);
  };

  const signUpMessageStyles = alertSignUp === "succesfully created an account !"
    ? "bg-green-500"
    : "bg-red-500";

  return (
    <div>
      <div className="flex bg-[white] justify-center items-center rounded-xl" onKeyDown={handleKeyPress}>
        <div className="w-[100%]">
          <div className="flex justify-end mt-1.5 mr-1.5 cursor" onClick={closePopup}>
            <Image src="/assets/close.png" alt="close" width={24} height={24}/>
          </div>
          <div className="w-[60%] ml-[20%] justify-center">

            <label className="block text-gray-700 font-bold">
              {FIELDS.USERNAME}
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-5 text-gray-700 leading-tight focus:outline-none"
              value={username}
              onChange={handleUsernameChange}
              required
              autoComplete="username"
            />
            <div className="mb-4 pt-4">
              <label className="block text-gray-700 font-bold">
                {FIELDS.EMAIL}
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-bold mb-2"
              >
                {FIELDS.PASSWORD}
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none "
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="mb-6">

            {alertSignUp && (
              <div className="fixed ml-[82%] top-20 left-0 w-full h-10 flex">
                <div
                  className={` ${
                    signUpMessageStyles
                  } text-white px-6 py-3 rounded-full text-sm animate-slide-up`}
                >
                  {alertSignUp}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center pb-4 justify-center">

            <button
              onClick={ ()=> handleSignup(email,password, username)}
              className="bg-lime-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {FIELDS.REGISTRATION}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute ml-[46%] mt-5">{loading && <Loading />}</div>
    </div>
  );
}
