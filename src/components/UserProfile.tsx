import { useSelector } from "react-redux";
import { UserExtra, UserInfo } from "../../util/interfaces";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";
import { selectMyId } from "../features/manager/manager-slice";
import { isUUID } from "validator";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";

export default function UserProfile({info} : {info: UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <div>
            <div>
                <img src={info.customIcon?.url || info.icon.source} alt="" />
                <div>
                    {info.username}
                </div>
                {info.aboutMe ? <div> {info.aboutMe} </div> : <></>}
                <div>
                    {formatRelative(new Date(info.joinedAt), new Date(), { locale })}
                </div>
            </div>
            {
            info.followers ? <div>
                <button onClick={() =>  stopFollowing({id: info.id})}>Stop Following</button>
            </div> : info.receivedRequests ? <div>
                Pending Request <button onClick={() => {
                    if (!info.receivedRequests) {
                        return;
                    }
                    deleteRequest({id: info.receivedRequests.id, type: "CANCEL", userid: info.id})
                    }}>X</button>
            </div> : (isUUID(myId) && <div> 
                    <button onClick={() => makeRequest({id: info.id, type: "FOLLOW"})}>Request Follow</button>
                    </div>) || <></>
            }
        </div>
    )
};