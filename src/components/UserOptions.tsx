import { useNavigate } from "react-router-dom";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { useDispatch } from "react-redux";
import { setUserId } from "../features/manager/manager-slice";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";

export default function UserOptions({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <div>
            <button onClick={() => {
                dispatch(setUserId(user.id));
                navigate("/user");
            }}>
                Profile
            </button>
            {
            user.followers ?
                <button onClick={(e) =>  {
                    e.stopPropagation();
                    stopFollowing({id: user.id});
                }}>Stop Following</button>
                 : user.receivedRequests ? <div>
                Pending Request <button onClick={(e) => {
                    e.stopPropagation();
                    if (!user.receivedRequests) {
                        return;
                    }
                    deleteRequest({id: user.receivedRequests.id, type: "CANCEL", userid: user.id})
                    }}>X</button>
            </div> : <div> 
                    <button onClick={(e) => {
                        e.stopPropagation();
                        makeRequest({id: user.id, type: "FOLLOW"});
                        }}>Request Follow</button>
                    </div>
            }
        </div>
    );
};