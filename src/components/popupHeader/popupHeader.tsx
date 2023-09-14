import {FourthPopupText,headerPopupFirstText,searchPopupFlagText,searchPopupGifText,secondPopupText, thirdPopupText} from "@/strings/indexText";
import { setInitialData } from "../../store/slices/votingSlice";
import { setPopupHeader } from "../../store/slices/popupSlice";
import { RootState } from "../../store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCardVote } from "../../firebase/firestore";
import { Loading } from "../loading";
import Image from "next/image";

export default function PopupHeader() {
  const [wordInput, setWordInput] = useState("");
  const [definitionInput, setDefinitionInput] = useState("");
  const [exampleInput, setExampleInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [inputError, setInpuError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const username = useSelector((state: RootState) => state.user.username);
  const userEmail = useSelector(({ user: { user } }: RootState) => user);
  const initialData = useSelector( ({ voting: { initialData = [] } }: RootState) => initialData );
  const popupState = useSelector(({ popup: { popupState } }: RootState) => popupState);

  const handleWordInputChange = ({target: { value = "" }}: React.ChangeEvent<HTMLInputElement>) => {
    setWordInput(value);
  };

  const handleDefinitionInputChange = ({ target: { value = "" }}: React.ChangeEvent<HTMLInputElement>) => {
    setDefinitionInput(value);
  };

  const handleExampleInputChange = ({ target: { value = "" }}: React.ChangeEvent<HTMLInputElement>) => {
    setExampleInput(value);
  };

  const handleTagsInputChange = ({target: { value = "" }}: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(value);
  };

  const handleSend = async () => {
    setLoading(true);
    const tagsArray = tagsInput.split(/[,\s]+/).map(tag => tag.trim()).filter(tag => tag !== "");
    const newVote = {
      title: wordInput.trim(),
      text: definitionInput.trim(),
      example: exampleInput.trim(),
      tags: tagsArray,
      userEmail: userEmail,
      username: username,
      created: new Date().toISOString()
    };

    const { title, text, example, tags } = newVote;

    if (title && text && example && tags && Array.isArray(initialData)) {

      const cardId = await setCardVote(userEmail, title, text, example, tags, username);

      const newVoteCard = { ...newVote, cardId };
      dispatch(setInitialData([newVoteCard, ...initialData]));
      dispatch(setPopupHeader(!popupState));
    } else {
      setInpuError("Please fill in all fields !");
    }
    setLoading(false);
  };

  const handleKeyPress = (event: { keyCode: number }) => {
    if (event.keyCode === 13) {
      handleSend();
    }
  };

  return (
    <>
      {loading ? <Loading /> : (
        <div className="text-black bg-[#FFFFFF] shadow-md md:w-[72%] lg:w-[68%] xl:w-[58%] absolute 2xl:w-[57%]" onKeyDown={handleKeyPress}>
          <p className="pt-4 ml-7 font-montserrat font-semibold text-4xl lg:text-5xl leading-12 sm:text-sm md:text-base">
        New Word
          </p>
          <p className="border-b-4 ml-7 border-black w-[34%]"> </p>
          <div className="mt-5">
            <p className="font-domine ml-7 font-normal text-base leading-4 lg:leading-5 lg:text-lg">
              {headerPopupFirstText}
            </p>

            <div className="mt-2 h-8 text-red-500 text-3xl flex justify-center">
              {inputError ? inputError : ""}
            </div>
            <input
              type="text"
              placeholder="Word..."
              className=" font-montserrat ml-7 text-3xl border-b w-[92%] border-black outline-none"
              value={wordInput}
              onChange={handleWordInputChange}
            />
          </div>
          <div className="mt-4">
            <div className="font-domine ml-7 font-normal  text-base leading-4  lg:text-lg  lg:leading-5 sm:text-sm md:text-base">
              {secondPopupText}
            </div>

            <input
              type="text"
              placeholder="Definition"
              className="mt-2 w-[92%] h-[1%] ml-7 font-montserrat font-bold outline-none border-b border-black text-base lg:text-lg sm:text-sm md:text-base"
              value={definitionInput}
              onChange={handleDefinitionInputChange}
            />

            <p className="font-domine font-normal ml-7 mt-2  text-base  lg:text-lg leading-4 lg:leading-5 sm:text-sm md:text-base">
              {thirdPopupText}
            </p>

            <input
              type="text"
              placeholder="Example Sentence"
              className="mt-2  w-[92%] h-[1%] ml-7 font-montserrat font-bold outline-none border-b border-black text-base lg:text-lg sm:text-sm md:text-base"
              value={exampleInput}
              onChange={handleExampleInputChange}
            />

            <p className="font-domine font-normal ml-7 mt-2  text-base lg:text-lg leading-4  lg:leading-5 sm:text-sm md:text-base">
              {FourthPopupText}
            </p>

            <input
              type="text"
              placeholder="Tags, Tags, Tags..."
              className="mt-1 w-[92%] h-[1%] ml-7 font-montserrat font-bold outline-none border-b border-black text-base lg:text-lg sm:text-sm md:text-base"
              value={tagsInput}
              onChange={handleTagsInputChange}
            />
            <div className=" flex pl-7 mt-2 pb-8">
              <div className="pt-2 mr-12">
                <div>
                  <p className="text-base lg:text-lg leading-4 lg:leading-5">
                    {searchPopupGifText}
                  </p>
                  <button className="flex absolute justify-center w-[20%] mt-2 lg:w-[18%] ml-2 pt-1 flex bg-neutral-300 rounded-3xl">
                Search.gif
                  </button>
                  <div className="relative rounded-3x1 mt-2">
                    <Image src="/assets/searchAnyGif.png" alt="searchGif" width={25} height={25}/>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-base lg:text-lg leading-4 lg:leading-5">
                  {searchPopupFlagText}
                </p>
                <button className="flex absolute justify-center mt-2 w-[20%] lg:w-[18%] pt-1 bg-neutral-300 rounded-3xl">
              Search.gif
                </button>
                <div className="relative rounded-3xl mt-2">
                  <Image src="/assets/searchFlagGif.png" alt="searchGif" width={25} height={25}/>
                </div>
              </div>
            </div>
            <button
              onClick={handleSend}
              className=" text-white w-full h-20 backgroundColorYellow font-montserrat text-4xl lg:text-5xl"
            >
          Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
