import { useNavigate } from "react-router-dom";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";

export default function UserOptions({user, styleStuff} : {user: UserFollowType & UserExtra | UserInfo & UserExtra, styleStuff?: React.CSSProperties }) {
    const navigate = useNavigate();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <div style={{position: "absolute", zIndex: 3,  ...styleStuff}}>
            <button onClick={() => {
                navigate(`/user?id=${user.id}`);
            }}>
                Profile
            </button>
            {
            (user.followers && user.followers.length > 0) ?
                <button onClick={(e) =>  {
                    e.stopPropagation();
                    stopFollowing({id: user.id});
                }}>Stop Following</button>
                 : (user.receivedRequests && user.receivedRequests.length > 0) ? <div>
                Pending Request <button onClick={(e) => {
                    e.stopPropagation();
                    if (!user.receivedRequests) {
                        return;
                    }
                    deleteRequest({id: user.receivedRequests[0].id, type: "CANCEL", userid: user.id})
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