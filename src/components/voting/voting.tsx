// import butverev from "../../../public/assets/butverev.png";
// import butnerqev from "../../assets/butnerqev.png";
import { FIELDS } from "@/constants";
import VotingButtom from "./components/votingButtom";
import { LikeComponent } from "./components/likeComponent";
import { delayStateChange } from "@/globalFunctions/delayStateChanges";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getCardData, getUserVote, getUserVotedAction, updateCardUserIds, updateCardVote } from "../../firebase/firestore";
import { Loading } from "../loading";

export interface IVotingText {
  title: string;
  text: string;
  example: string;
  tags: string[];
  username: string;
  likeState: number;
  dislikeState: number;
  cardId: string;
  created: string;
  addItCountI: number;
  keepOutCountI: number;
  cantDecideCountI: number;
}

export default function Voting({cardId, title, text, example, tags, username, likeState, dislikeState, created}: IVotingText ) {

  const [likeCount, setLikeCount] = useState(likeState);
  const [dislikeCount, setDislikeCount] = useState(dislikeState);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [isLikeDislikePopup, setIsLikeDislikePopup] = useState("");
  const [likeDIslikeloading, setLikeDislikeLoading] = useState(false);
  const [cardButtomsLoading, setCardButtomsLoading] = useState(false);
  const isLoggedIn = useSelector(({ user: { isLoggedIn } }: RootState) => isLoggedIn);
  const userId = useSelector(({user: {userId}}: RootState)=> userId);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedVote, setSelectedVote] = useState<"addIt" | "keepOut" | "cantDecide" | null>(null);
  const [loadData, setLoadData] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cardData = await getCardData(cardId);
        setLikeCount(cardData.like || 0);
        setDislikeCount(cardData.dislike || 0);

        if (isLoggedIn) {
          const userVoteData = await getUserVote(cardId, userId);
          setUserVote(userVoteData);
        }

        if (isLoggedIn) {
          const userVotedAction = await getUserVotedAction(cardId, userId);
          setSelectedVote(userVotedAction);
          setLoadData(false);
        }
      } catch (error) {
        alert(error);
      }
    })();
  }, [cardId, isLoggedIn, userId]);

  const handleLike = async () => {
    if (isLoggedIn) {
      try{
        if (userVote === FIELDS.LIKE) {
          setLikeCount((prev) => prev - 1);
          setUserVote(null);
          setLikeDislikeLoading(true);
          await updateCardVote(cardId, userId, false, false);
        } else {
          setLikeCount((prev) => prev + 1);
          setDislikeCount((prev) => (userVote === FIELDS.DISLIKE ? prev - 1 : prev));
          setUserVote("like");
          setLikeDislikeLoading(true);
          await updateCardVote(cardId, userId, true, userVote === FIELDS.DISLIKE);
        }
      } catch(error) {
        alert(error);
      } finally {
        setLikeDislikeLoading(false);
      }
    } else {
      setIsLikeDislikePopup("Please Sign In or Sign Up!");
      delayStateChange(() => setIsLikeDislikePopup(""));
    }
  };

  const handleDislike = async () => {
    if (isLoggedIn) {
      try {
        if (userVote === FIELDS.DISLIKE) {
          setDislikeCount((prev) => prev - 1);
          setUserVote(null);
          setLikeDislikeLoading(true);
          await updateCardVote(cardId, userId, false, false);
        } else {
          setDislikeCount((prev) => prev + 1);
          setLikeCount((prev) => (userVote === FIELDS.LIKE ? prev - 1 : prev));
          setUserVote("dislike");
          setLikeDislikeLoading(true);
          await updateCardVote(cardId, userId, userVote === FIELDS.LIKE, true);
        }
      } catch(error) {
        alert(error);
      } finally {
        setLikeDislikeLoading(false);
      }
    } else {
      setIsLikeDislikePopup("Please Sign In or Sign Up!");

      delayStateChange(() => setIsLikeDislikePopup(""));

    }
  };


  const handleVote = async (voteType: "addIt" | "keepOut" | "cantDecide") => {
    if (isLoggedIn && selectedVote === null) {
      setCardButtomsLoading(true);
      try {
        await updateCardUserIds(cardId, userId, voteType);

        setSelectedVote(voteType);

        setPopupMessage("Thanks for voting!");

        delayStateChange(() => setPopupMessage(""));

      } catch (error) {
        alert(error);
      } finally {
        setCardButtomsLoading(false);
      }
    } else {
      setIsLikeDislikePopup("Please Sign In or Sign Up!");
      delayStateChange(() => setIsLikeDislikePopup(""));
    }
  };


  return (
    <div className="w-full flex justify-center p-1">
      <div className="w-full mt-4 md:w-[70%] lg:w-[65%] xl:w-[58%] 2xl:w-[40%] bg-white shadow-md rounded-b bg-blue break-words">
        <div className="mt-6 ml-5 mb-8 font-montserrat font-normal font-semibold text-4xl leading-6">
          <h1>{title}</h1>
        </div>
        <div className="w-full mx-auto ml-2 p-4 whitespace-pre-wrap font-domine font-bold text-lg font-domine font-normal text-base lg:text-lg lg:leading-7 sm:text-sm md:text-base">
          <p className="leading-5">{text}</p>
          <p className="leading-7 mt-8">{example}</p>
          <p className="pt-10 leading-8">
            {tags.map((tag, index) => (
              <span key={index} className="bg-black text-yellow-500 px-3 m-0.5 p-1 font-domine text-xl">
                {tag}
              </span>
            ))}
          </p>
        </div>
        <div className="pt-5 ml-5 font-montserrat leading-6">by: <span className=" font-montserrat text-xl ml-2 mr-1">{username}</span> {new Date(created).toLocaleString("en-US", {month: "long", day: "numeric", year: "numeric" })}</div>
        <div className="flex ml-auto gap-4 w-20 h-20">
          {likeDIslikeloading ? <div className="ml-5"><Loading /></div> : (
            <>
              <LikeComponent
                img="/assets/butVerev.png"
                alt="butVerev"
                count={likeCount}
                handleLikeUnlike={handleLike}
                cardId={cardId}
                disabled={!isLoggedIn}
              />
              <LikeComponent
                img={"/assets/butnerqev.png"}
                alt="butNerqev"
                count={dislikeCount}
                handleLikeUnlike={handleDislike}
                cardId={cardId}
                disabled={!isLoggedIn}
              />
            </>
          )}
        </div>
        {isLikeDislikePopup && (
          <div className={"fixed text-white px-6 py-3 rounded-full text-sm animate-slide-up bg-red-500 right-10 top-[15%]"}>
            {isLikeDislikePopup}
          </div>
        )}
        <div className="flex items-center justify-center w-full h-5">

          {popupMessage && (
            <div className="text-white px-6 py-3 rounded-full text-bold animate-slide-up bg-yellow-500">
              {popupMessage}
            </div>
          )}

        </div>
        <div className="flex w-full justify-center h-20">
          {cardButtomsLoading || loadData && isLoggedIn ? <div className="flex justify-center mb-10 w-[60%]"><Loading /><Loading /><Loading /></div> : (
            <>
              { selectedVote === null &&
              <>
                <VotingButtom
                  button="Add it"
                  backgroundColor="backgroundColorGreen"
                  handleVotingButtons={() => handleVote("addIt")}
                />
                <VotingButtom
                  button="Keep out"
                  backgroundColor="backgroundColorRed"
                  handleVotingButtons={() => handleVote("keepOut")}
                />
                <VotingButtom
                  button="I can't decide"
                  backgroundColor="backgroundColorGrey"
                  handleVotingButtons={() => handleVote("cantDecide")}
                />
              </>
              }
            </>
          )}
        </div>
      </div>
    </div>
  );
}


