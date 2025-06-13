import { UserExtra, UserInfo } from "../../util/interfaces";

export default function MiniUser({user} : {user: UserInfo & UserExtra }) {
    return (
        <div className="searchResult" data-userid={user.id}>
            <div>{user.username}</div>
            <img src={user.customIcon?.url || user.icon.source} alt="" />
        </div>
    )
};