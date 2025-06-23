import { isUUID } from "validator";
import { optionalIdArray, SimpleButtonClickFunction } from "../../util/types";

export default function LikeButton({myId, likesInfo, clickFunction} : {myId: string, likesInfo: optionalIdArray, clickFunction: SimpleButtonClickFunction }) {
    return (
        <>
             { isUUID(myId) &&
                <button 
                    {...((likesInfo && likesInfo.length > 0) ? {style: {backgroundColor: "black"}} : {})}
                    onClick={clickFunction}
                >L</button>
            }
        </>
    )
};