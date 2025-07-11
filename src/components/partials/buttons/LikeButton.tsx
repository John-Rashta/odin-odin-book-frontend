import { isUUID } from "validator";
import { optionalIdArray, SvgClickFunction } from "../../../../util/types";
import { ThumbsUp } from "lucide-react";
import { clickClass } from "../../../../util/globalValues";

export default function LikeButton({
  myId,
  likesInfo,
  clickFunction,
}: {
  myId: string;
  likesInfo: optionalIdArray;
  clickFunction: SvgClickFunction;
}) {
  return (
    <>
      {isUUID(myId) && (
        <ThumbsUp
          className={clickClass}
          {...(likesInfo && likesInfo.length > 0 ? { fill: "black" } : {})}
          onClick={clickFunction}
        />
      )}
    </>
  );
}
