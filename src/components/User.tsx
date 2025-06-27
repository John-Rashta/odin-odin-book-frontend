import { useSelector } from "react-redux";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import FollowOptions from "./FollowOptions";
import ShowOptions from "./ShowOptions";
import styled from "styled-components";


export default function User({user} : {user: UserFollowType & UserExtra | UserInfo & UserExtra }) {
    const myId = useSelector(selectMyId);

    return (
        <StyledUser className="clickOption" data-userid={user.id}>
            <StyledStart>
                <StyledImage className="userOption" data-userid={user.id} src={user.customIcon?.url || user.icon.source} alt="" />
                <StyledUsername className="userOption" data-userid={user.id}>{user.username}</StyledUsername>
            </StyledStart>
            <FollowOptions followers={user.followers} requests={user.receivedRequests} myId={myId} id={user.id}/>
            <ShowOptions myId={myId} id={user.id} userStuff={{user}}  />
        </StyledUser>
    )
};

const StyledUser = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    margin-bottom: -1px;
    border-bottom: solid 1px black;
    border-top: solid 1px black;
    padding: 15px;
    font-size: 1.1rem;
    background-color: rgb(193, 227, 255);
    &:hover {
        background-color: rgb(216, 243, 255);
    };
`;

const StyledStart = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    
`;

const StyledUsername = styled.div`
    cursor: pointer;
    &:hover {
        text-decoration-line: underline;
    };
`;

const StyledImage = styled.img`
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    };
`;