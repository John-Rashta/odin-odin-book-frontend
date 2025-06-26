import { useNavigate } from "react-router-dom";
import { UserExtra, UserFollowType, UserInfo } from "../../util/interfaces";
import { useDeleteRequestMutation, useMakeRequestMutation, useStopFollowMutation } from "../features/book-api/book-api-slice";
import styled from "styled-components";

export default function UserOptions({user, styleStuff} : {user: UserFollowType & UserExtra | UserInfo & UserExtra, styleStuff?: React.CSSProperties }) {
    const navigate = useNavigate();
    const [ stopFollowing ] = useStopFollowMutation();
    const [ deleteRequest ] = useDeleteRequestMutation();
    const [ makeRequest ] = useMakeRequestMutation();
    return (
        <StyledUserOptions style={{...styleStuff}}>
            <StyledButtons onClick={() => {
                navigate(`/user?id=${user.id}`);
            }}>
                Profile
            </StyledButtons>
            {
            (user.followers && user.followers.length > 0) ?
                <StyledButtons onClick={(e) =>  {
                    e.stopPropagation();
                    stopFollowing({id: user.id});
                }}>Stop Following</StyledButtons>
                 : (user.receivedRequests && user.receivedRequests.length > 0) ? 
                <StyledButtons onClick={(e) => {
                    e.stopPropagation();
                    if (!user.receivedRequests) {
                        return;
                    }
                    deleteRequest({id: user.receivedRequests[0].id, type: "CANCEL", userid: user.id})
                    }}>Cancel Request</StyledButtons>
             :  
                    <StyledButtons onClick={(e) => {
                        e.stopPropagation();
                        makeRequest({id: user.id, type: "FOLLOW"});
                        }}>Request Follow</StyledButtons>
                    
            }
        </StyledUserOptions>
    );
};

const StyledUserOptions = styled.div`
    position: absolute;
    max-width: 200px;
    width: 120px;
    z-index: 3;
    button {
        border: none;
        flex-grow: 1;
        padding: 5px;
        background-color: rgb(196, 241, 255);
    };
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    gap: 1px;
    background-color: black;
`;

const StyledButtons = styled.button`
    border: none;
    flex-grow: 1;
    padding: 5px;
    background-color: rgb(196, 241, 255);
    &:hover {
        background-color: rgb(136, 207, 255);
    };
    font-weight: bold;
`;