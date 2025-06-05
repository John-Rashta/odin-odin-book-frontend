import { useSelector } from "react-redux";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";

export default function User({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <div data-userid={user.id}>
            <img src={user.customIcon?.url || user.icon.source} alt="" />
            <div>{user.username}</div>
            {
                user.followers ? <div>
                   <button onClick={() =>  stopFollowing({id: user.id})}>Stop Following</button>
                </div> : user.receivedRequests ? <div>
                    Pending Request <button onClick={() => {
                        if (!user.receivedRequests) {
                            return;
                        }
                        deleteRequest({id: user.receivedRequests.id, type: "CANCEL", userid: user.id})
                        }}>X</button>
                </div> : (isUUID(myId) && <div> 
                        <button onClick={() => makeRequest({id: user.id, type: "FOLLOW"})}>Request Follow</button>
                     </div>) || <></>
            }
        </div>
    )
};