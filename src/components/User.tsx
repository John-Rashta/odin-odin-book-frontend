import { useSelector } from "react-redux";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import FollowOptions from "./FollowOptions";
import ShowOptions from "./ShowOptions";


export default function User({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);

    return (
        <div className="clickOption" data-userid={user.id}>
            <img className="userOption" data-userid={user.id} src={user.customIcon?.url || user.icon.source} alt="" />
            <div className="userOption" data-userid={user.id}>{user.username}</div>
            <FollowOptions followers={user.followers} requests={user.receivedRequests} myId={myId} id={user.id}/>
            <ShowOptions myId={myId} id={user.id} userStuff={{user}}  />
        </div>
    )
};