import { useSelector } from "react-redux";
import { UserExtra, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import FollowOptions from "./FollowOptions";

export default function UserProfile({info} : {info: UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);
    
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
                <div>
                    {info.followerCount}
                </div>
            </div>
            <FollowOptions followers={info.followers} requests={info.receivedRequests} myId={myId} id={info.id} />
        </div>
    )
};