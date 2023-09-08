interface VotingButtomProps {
    button: string;
    backgroundColor: string;
    handleVotingButtons : () => void;
  }

export default function VotingButtom({
  button,
  backgroundColor,
  handleVotingButtons,
}: VotingButtomProps) {
  return (
    <div className="flex flex-wrap ml-1 mt-7 mb-6">
      <button
        className={`${backgroundColor} flex justify-center items-center w-[120px] h-[37px]`}
        onClick={handleVotingButtons}
      >
        {button}
      </button>
    </div>
  );
}
