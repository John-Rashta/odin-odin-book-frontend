import { useSelector } from "react-redux";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import UserOptions from "./UserOptions";

export default function User({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div className="clickOption" data-userid={user.id}>
            <img className="userOption" data-userid={user.id} src={user.customIcon?.url || user.icon.source} alt="" />
            <div className="userOption" data-userid={user.id}>{user.username}</div>
            {
                (user.followers && user.followers.length > 0)? <div>
                   <button onClick={() =>  stopFollowing({id: user.id})}>Stop Following</button>
                </div> : (user.receivedRequests && user.receivedRequests.length > 0) ? <div>
                    Pending Request <button onClick={() => {
                        if (!user.receivedRequests) {
                            return;
                        }
                        deleteRequest({id: user.receivedRequests[0].id, type: "CANCEL", userid: user.id})
                        }}>X</button>
                </div> : ((isUUID(myId) && myId !== user.id) && <div> 
                        <button onClick={(e) => {
                            e.stopPropagation();
                            makeRequest({id: user.id, type: "FOLLOW"});
                        }}>Request Follow</button>
                     </div>) || <></>
            }
            <div style={{position: "relative"}}>
                {
                    myId !== user.id ? <Ellipsis onClick={() => {
                        setShowOptions(!showOptions)
                    }} /> : <></>
                }
                {
                showOptions && <UserOptions user={user}/>
                }
            </div>
        </div>
    )
};