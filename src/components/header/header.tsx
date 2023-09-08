// import searchIcon from "../../assets/searchIcon.png";
// import whiteSearch from "../../assets/whiteSearch.png";
// import urbanIcon from "../../assets/urbanIcon.png";
// import klor from "../../assets/klor.png";
// import plus from "../../assets/plus.png";
// import slaqner from "../../assets/slaqner.png";
// import kloriX from "../../assets/kloriX.png";
// import groupLetters from "../../assets/groupLetters.png";
// import hamburger from "../../assets/hamburger.png";
// import burgerYellow from "../../assets/burgerYellow.png";
// import star from "../../assets/star.png";
// import { navigatePages } from "./headerUtils";
//import { useNavigate, useLocation } from "react-router-dom";
import Image from "next/image";
import { navigatePages } from "./headerUtils";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import PopupHeader from "../popupHeader/popupHeader";
import { useDispatch, useSelector } from "react-redux";
import { setInitialData, setFilteredData, setInitialDataLoading, } from "../../store/slices/votingSlice";
import { setPopupHeader } from "../../store/slices/popupSlice";
import { RootState } from "../../store/store";
import { IVotingText } from "../voting/voting";
import { ROUTES } from "../../configRoutes";
import { handleLogIn } from "./headerUtils";
import { logOut } from "../../firebase/auth";
import { cardInfo } from "../../firebase/firestore";
import { useRouter } from "next/router";

export default function Header() {
  //const navigate = useNavigate();
  //const location = useLocation();
  const router = useRouter();
  const location = router.asPath;
  const dispatch = useDispatch();
  const [burger, setburger] = useState(false);
  const [inputText, setInputText] = useState("");
  const [alertMustSignin, setAlertMustSignin] = useState("");

  const isLoggedIn = useSelector(({ user: { isLoggedIn } }: RootState) => isLoggedIn);
  const initialData = useSelector(({ voting: { initialData } }: RootState) => initialData );
  const showAlertState = useSelector( ({ showAlert: { showAlertState } }: RootState) => showAlertState);
  const popupState = useSelector(({ popup: { popupState } }: RootState) => popupState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value.toLowerCase());
    dispatch(setInitialDataLoading(true));
  };

  useEffect(() => {
    (async () => {
      try {
        dispatch(setInitialDataLoading(true));
        const data = await cardInfo();
        dispatch(setInitialData(data));
      } catch (error) {
        alert(error);
      } finally {
        dispatch(setInitialDataLoading(false));
      }
    })();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (Array.isArray(initialData)) {
        if (inputText.trim() === "") {
          dispatch(setFilteredData(initialData));
          dispatch(setInitialDataLoading(false));
        } else {
          const filteredData = initialData.filter(({ title }: IVotingText) => title.toLowerCase().includes(inputText));
          dispatch(setFilteredData(filteredData));
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [isLoggedIn, inputText, initialData, dispatch]);

  useEffect(() => {
    if (popupState) {
      document.body.classList.add("freeze-scroll");
    } else {
      document.body.classList.remove("freeze-scroll");
    }
  }, [popupState]);

  const checkIsLogedIn = () => {
    if (isLoggedIn && !popupState) {
      dispatch(setPopupHeader(true));
    } else if(isLoggedIn && popupState) {
      dispatch(setPopupHeader(false));
    }
    else {
      setAlertMustSignin("You must Sign In or Sign Up !");
      router.push(ROUTES.LOGIN);
      setTimeout(() => {
        setAlertMustSignin("");
      }, 2000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-[#1e2538] w-full h-16">
        {!burger ? (
          <div className="ml-2">
            <div className=" relative px-3 md:px-5 mt-3 h-9 md:h-11 rounded-t">
              <div className="absolute rounded- top-4 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="cursor"
                  onClick={() => {
                    setburger(!burger);
                  }}
                >
                  <div className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/burgerYellow.png" alt="burgYellow" width={17} height={1} className="ml-2"/>
                  </div>
                  <div className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/burgerYellow.png" alt="burgYellow" width={17} height={1} className="ml-2"/>
                  </div>
                  <div className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/burgerYellow.png" alt="burgYellow" width={17} height={1} className="ml-2"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ml-2">
            <div className=" relative px-3 md:px-5 mt-10 md:mt-20 h-24 md:h-28 rounded-t bg-white">
              <div className="absolute bg-white rounded-md top-14 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="cursor"
                  onClick={() => {
                    setburger(!burger);
                  }}
                >
                  <div className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/hamburger.png" alt="burgBlack" width={17} height={1} className="ml-2"/>
                  </div>
                  <div  className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/hamburger.png" alt="burgBlack" width={17} height={1} className="ml-2"/>
                  </div>
                  <div className="mb-1 md:w-8 md:h-0.5">
                    <Image src="/assets/hamburger.png" alt="burgBlack" width={17} height={1} className="ml-2"/>
                  </div>
                </div>
                <div className="cursor mt-6 md:mt-7 ml-2">
                  <Image src="/assets/star.png" alt="star" width={20} height={0.5}/>
                </div>
                <div  className="cursor mt-4 ml-2">
                  <Image src="/assets/slaqner.png" alt="slackIcon" width={20} height={0.5}/>
                </div>
              </div>
            </div>
            <div className="absolute w-10 mt-0.5 bg-white rounded-b">
              <div className="ml-2.5 mt-2 mb-2">
                <Image src="/assets/groupLetters.png" alt="letters" width={23} height={15}/>
              </div>
            </div>
          </div>
        )}
        <div className="cursor m-2" onClick={() => {
          navigatePages(router, location, ROUTES.VOTE);
          //router.push(ROUTES.VOTE)
        }}>
          <Image src="/assets/urbanIcon.png" alt="titleUrban" width={156} height={21}/>
        </div>
        {!popupState ? (
          <div className="flex w-[37%] mr-[8%] m-10">
            <span className="absolute">
              <div className=" h-4 ml-2 mt-4 cursor">
                <Image src="/assets/searchIcon.png" alt="search" width={14} height={14}/>
              </div>
            </span>
            <input
              onChange={handleInputChange}
              className="outlineNone w-[100%] h-10 pl-7 bg-gray-100 rounded-lg placeholder-gray-400 font-domine font-normal text-base leading-6"
              placeholder="Type any word..."
            />
          </div>
        ) : (
          <div className="flex w-[37%] mr-[8%] m-10">
            <span>
              <div className="absolute h-4 mt-4 ml-2 cursor">
                <Image src="/assets/whiteSearch.png" alt="search" width={14} height={14}/>
              </div>
            </span>
            <p className="w-[100%] h-10"></p>
          </div>
        )}
        <div className="text-yellow-400 flex items-center justify-center gap-10 font-domine font-normal leading-6 ">
          <button
            onClick={checkIsLogedIn}
            className="cursor z-10 pt-0.5 justify-center items-center flex mt-16 bg-[#e3e1e1] border border-solid border-[#e3e1e1] border-2 rounded-full"
          >
            {!popupState ? (
              <>
                <div className="flex absolute">
                  <Image src="/assets/klor.png" alt="round" width={64} height={64}/>
                </div>
                <div className="flex absolute mb-1">
                  <Image src="/assets/plus.png" alt="plus" width={24} height={24}/>
                </div>
              </>
            ) : (
              <>
                <div className="flex absolute">
                  <Image src="/assets/klor.png" alt="round" width={64} height={64}/>
                </div>
                <div className="flex absolute mb-1">
                  <Image src="/assets/kloriX.png" alt="minus" width={22} height={22}/>
                </div>
              </>
            )}
          </button>
          <p
            className={`mr-2 cursor md:w-16 flex border-b-4 h-16 justify-center items-center ${
              router.pathname === ROUTES.LOGIN && !popupState
                ? "border-yellow-400"
                : "border-[#1e2538]"
            }`}
            onClick={isLoggedIn ? () => logOut(router) : () => handleLogIn(router, location)}
          >
            {isLoggedIn ? "LogOut" : "Login"}
          </p>
          {alertMustSignin && (
            <div className="absolute mt-48 ml-80 text-white px-6 py-3 rounded-full text-sm animate-slide-up bg-red-500">
              {alertMustSignin}
            </div>
          )}
          {showAlertState && (
            <div className="fixed ml-[85%] top-20 left-0 w-full h-10 flex">
              <div className="bg-green-500 text-white px-6 py-3 rounded-full text-sm animate-slide-up">
                Sign in successful !
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`${
          popupState ? "h-full w-full absolute backdrop-blur-sm bg-[#1c1917] bg-opacity-40" : ""
        }`}
      >
        {popupState && (
          <OutsideClickHandler
            onOutsideClick={(e) => {
              const target = e.target as HTMLElement;
              if(target && target.getAttribute("alt") !== "minus") {
                dispatch(setPopupHeader(false));
              }
            }}
          >
            <div className="flex justify-center ">{<PopupHeader />}</div>
          </OutsideClickHandler>
        )}
      </div>
    </div>
  );
}
