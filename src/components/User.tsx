import { useSelector } from "react-redux";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { useState } from "react";
import UserOptions from "./UserOptions";
import FollowOptions from "./FollowOptions";
import ShowOptions from "./ShowOptions";
import { ButtonClickType } from "../../util/types";

export default function User({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);
    const [showOptions, setShowOptions] = useState(false);

    const handleClick = function handleClickButton(e: ButtonClickType) {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };

    return (
        <div className="clickOption" data-userid={user.id}>
            <img className="userOption" data-userid={user.id} src={user.customIcon?.url || user.icon.source} alt="" />
            <div className="userOption" data-userid={user.id}>{user.username}</div>
            <FollowOptions followers={user.followers} requests={user.receivedRequests} myId={myId} id={user.id}/>
            <div style={{position: "relative"}}>
                <ShowOptions myId={myId} id={user.id} clickFunction={handleClick} />
                {
                showOptions && <UserOptions user={user}/>
                }
            </div>
        </div>
    )
};