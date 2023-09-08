//import plus from "../../assets/plus.png";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setPopupHeader } from "../../store/slices/popupSlice";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../configRoutes";
import { delayStateChange } from "@/globalFunctions/delayStateChanges";
import Image from "next/image";
import { useRouter } from "next/router";

export default function DefinTheWord() {
  const [alertMustSignin, setAlertMustSignin] = useState("");
  const popupState = useSelector(({popup: {popupState} }: RootState) => popupState);
  const isLoggedIn = useSelector(({ user: { isLoggedIn } }: RootState) => isLoggedIn);
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const router = useRouter();

  const handleCheckIsLogedIn = () => {
    if(isLoggedIn && !popupState) {
      dispatch(setPopupHeader(true));
    } else {
      setAlertMustSignin("You must Sign In or Sign Up !");
      router.push(ROUTES.LOGIN);

      delayStateChange(() => setAlertMustSignin(""));

    }
  };

  return (
    <div className="ml-[83%]">
      <div className={`hidden lg:block fixed ${popupState ? "blur-sm" : ""} top-[40%]`}>
        <div className='sm:w-[60%]'>
          <p className='ml-6 font-semibold text-lg leading-29'>URBAN DICTIONARY IS WRITTEN BY YOU</p>
          <div className={`${popupState ? "blur-sm" : "cursor"}`} onClick={handleCheckIsLogedIn}>
            <p className='absolute pt-2 backgroundColorYellow w-[141px] h-[37px] text-[14px] ml-4 pl-9 font-semibold'>
              Define a word
            </p>
            <div className='absolute mt-1.5 ml-5'>
              <Image src="/assets/plus.png" alt='plus' width={24} height={24}/>
            </div>
          </div>
        </div>
      </div>
      {alertMustSignin && (
        <div className="absolute font-normal text-white px-6 py-3 rounded-full mt-10 text-sm animate-slide-up bg-red-500">
          <text>{alertMustSignin}</text>
        </div>
      )}
    </div>
  );
}
