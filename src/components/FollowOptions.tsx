import { isUUID } from "validator";
import { optionalIdArray } from "../../util/types";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";

export default function FollowOptions({myId, id, followers, requests} : {myId: string, id: string, followers: optionalIdArray, requests: optionalIdArray}) {
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <>
            {(isUUID(myId) && myId !== id) && (
                (followers && followers.length > 0)? <div>
                    <button onClick={() =>  stopFollowing({id: id})}>Stop Following</button>
                </div> : (requests && requests.length > 0) ? <div>
                    Pending Request <button onClick={() => {
                        if (!requests) {
                            return;
                        }
                        deleteRequest({id: requests[0].id, type: "CANCEL", userid: id})
                        }}>X</button>
                </div> : <div> 
                        <button onClick={(e) => {
                            e.stopPropagation();
                            makeRequest({id: id, type: "FOLLOW"});
                        }}>Request Follow</button>
                        </div>
                )
            }
        </>
    )
}