import Voting, { type IVotingText } from "../components/voting/voting";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../components/loading";
import { useEffect } from "react";
import { setInitialDataLoading, setInitialData } from "../store/slices/votingSlice";
import { getCardInfo } from "@/firebase/firestore";

interface HomeProps {
  data: IVotingText[];
}

export async function getStaticProps() {
  try {
    const data = await getCardInfo();
    return {
      props: {
        data,
      },
      revalidate: 0,
    };
  } catch (error) {
    return {
      props: {
        data: []
      },
    };
  }
}


export default function Home({ data }: HomeProps) {

  const filteredData = useSelector(({ voting: { filteredData } }) => filteredData);
  const initialDataLoading = useSelector(({ voting: {initialDataLoading} }) => initialDataLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setInitialData(data));
    dispatch(setInitialDataLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center flex-col">
        <div className="mt-10 mr-[10%] mb-3">
          <h1 className="font-semibold text-2xl leading-2xl font-montserrat">
              Power to the people
          </h1>
          <p className="font-domine font-normal leading-4">
              Vote for add new words to the dictionary
          </p>
        </div>
        {
          !filteredData || initialDataLoading ? <Loading /> :
            filteredData && filteredData.length ? (
              <div className="w-full">
                {filteredData.length > 0 && (
                  filteredData.map(
                    (
                      {cardId, title, text, tags, example, username, created }: IVotingText,
                      index: number
                    ) => (
                      <Voting
                        key={index}
                        cardId={cardId}
                        title={title}
                        text={text}
                        tags={tags}
                        example={example}
                        username={username}
                        likeState={0}
                        dislikeState={0}
                        created={created}
                        addItCountI={0}
                        keepOutCountI={0}
                        cantDecideCountI={0}
                      />
                    )
                  )
                )
                }
              </div>
            ) : !filteredData.length &&
                <p className="flex justify-center mt-[9%] font-montserrat  text-4xl">
                Not Found !
                </p>
        }
      </div>
    </div>
  );
}
