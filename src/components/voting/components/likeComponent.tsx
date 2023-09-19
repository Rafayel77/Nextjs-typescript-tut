import Image from "next/image";
interface ILike {
    img: string;
    alt: string;
    count: number | JSX.Element;
    handleLikeUnlike: (event: React.MouseEvent<HTMLImageElement>) => void;
    cardId: string,
    disabled: boolean,
  }

export function LikeComponent({ img, alt, count, handleLikeUnlike, disabled }: ILike) {

  return (
    <div>
      <div className="mb-2">
        <Image className={`cursor ${disabled ? "disabled" : ""}`} onClick={handleLikeUnlike} src={img} alt={alt} width={28} height={28}
        />
        <p className=" mt-1 ml-2">{count}</p>
      </div>
    </div>
  );
}
