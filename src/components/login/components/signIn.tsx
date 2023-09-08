//import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { SignUpPopup } from "./signUpPopup";
import { delayStateChange } from "@/globalFunctions/delayStateChanges";
import { FIELDS } from "@/constants";
import { signIn } from "@/firebase/auth";
import { ROUTES } from "@/configRoutes";
import { Loading } from "@/components/loading";
import { setShowAlert } from "@/store/slices/showAlertSlice";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  //const navigate = useNavigate();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const isSignIn = await signIn(email, password);
    setLoading(false);

    if(isSignIn === true) {
      router.push(ROUTES.VOTE);

      delayStateChange(() => dispatch(setShowAlert(false)));

    } else {
      setShowInvalid(true);

      delayStateChange(() => setShowInvalid(false));

    }
  };

  const handleKeyPress = (event: { keyCode: number }) => {
    if (event.keyCode === 13 && !isRegistrationOpen) {
      handleSignIn(email,password);
    }
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

  const openRegistrationPopup = () => {
    setIsRegistrationOpen(true);
  };

  return (
    <div>
      <div className="flex justify-center items-center" onKeyDown={handleKeyPress}>
        <div className="w-[100%]">
          <div className="mb-4 w-[90%] ml-[5%] justify-center">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-1"
            >
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
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mt-6 mb-1"
              >
                {FIELDS.PASSWORD}
              </label>
            </div>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="pt-2 mb-1">
            <div>
              <button
                onClick={() => handleSignIn(email, password)}
                className="bg-blue-500 hover:bg-blue-700 ml-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>

              <button
                onClick={openRegistrationPopup}
                className="bg-blue-500 ml-2 bg-lime-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
            {showInvalid && (
              <div className="fixed ml-[85%] top-20 left-0 w-full h-10 flex">
                <div className="bg-red-500 text-white px-6 py-3 rounded-full text-sm animate-slide-up">
                  Invalid email or password !
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute w-[100%]">
          {isRegistrationOpen && (
            <SignUpPopup setIsRegistrationOpen={setIsRegistrationOpen} />
          )}
        </div>
      </div>
      <div> <div className="absolute ml-[22%] mt-8">{loading && <Loading />}</div></div>
    </div>
  );
}

