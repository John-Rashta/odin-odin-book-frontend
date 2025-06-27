import styled from "styled-components";
import { UserExtra, UserInfo } from "../../util/interfaces";

export default function MiniUser({user} : {user: UserInfo & UserExtra }) {
    return (
        <StyledMiniUser className="searchResult" data-userid={user.id}>
            <div>{user.username}</div>
            <img src={user.customIcon?.url || user.icon.source} alt="" />
        </StyledMiniUser>
    )
};

const StyledMiniUser = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px;
    &:hover {
        background-color: rgb(168, 205, 253);
    }
`;