import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import CommentEdit from "./CommentEdit";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { useChangeCommentLikeMutation } from "../features/book-api/book-api-slice";
import TextOptions from "./TextOptions";
import LikeButton from "./LikeButton";
import ShowOptions from "./ShowOptions";
import { ButtonClickType, ClickType } from "../../util/types";
import ClickWrapper from "./ClickWrapper";
import { useNavigate } from "react-router-dom";
import { StyledContent, StyledFlex, StyledImage, StyledMessageImage, StyledUserBlue } from "../../util/style";
import styled from "styled-components";
import { MessageSquare } from "lucide-react";

export default function CommentProfile({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const [showOptions, setShowOptions] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangeCommentLikeMutation();
    const navigate = useNavigate();

    const handleClick = function handleClickingButton(e: ButtonClickType) {
         e.stopPropagation();
        setShowOptions(!showOptions);
    };

     const handleUserClick = function handleClickUser(e: ClickType) {
        e.stopPropagation();
        navigate(`/user?id=${comment.senderid}`);
    };

    return (
        <StyledContainer>
        <div >
            <StyledImage onClick={handleUserClick} src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
        </div>
        {showEdit ? <StyledEdit comment={comment} changeEdit={() =>  {
            setShowEdit(false);
        }} /> :
            <StyledMainStuff>
                <StyledMainStuff>
                    <StyledTop>
                        <StyledFlex>
                            <StyledUserBlue onClick={handleUserClick}>
                                {comment.sender.username}
                            </StyledUserBlue>
                            <StyledEdited>
                                {formatRelative(new Date(comment.sentAt), new Date(), { locale })}
                            </StyledEdited>
                        </StyledFlex>
                        <StyledFlex>
                            <StyledEdited>
                                {comment.edited ? "Edited" : ""}
                            </StyledEdited>
                            <ShowOptions myId={myId} id={comment.senderid} textStuff={{
                                textId: comment.id,
                                type: "COMMENT",
                                editFunc: () =>  setShowEdit(true),
                            }} />
                        </StyledFlex>
                    </StyledTop>
                    <div>
                        <StyledContent>
                            {comment.content}
                        </StyledContent>
                        {comment.image ? <StyledMessageImage src={comment.image.url} alt="" /> : <></>}
                    </div>
                    <StyledBottom>
                        <StyledBottomLeft>
                            {comment.ownCommentsCount > 0 ? <>
                                <StyledCounts>
                                    {comment.ownCommentsCount}
                                </StyledCounts>
                                <MessageSquare/>
                            </> 
                            : " "}
                        </StyledBottomLeft>
                        <StyledFlex>
                            <StyledLikes>
                            {comment.likesCount > 0 ? comment.likesCount : ""}
                            </StyledLikes>
                            <LikeButton myId={myId} likesInfo={comment.likes} clickFunction={(e) => {
                                e.stopPropagation();
                                ///e.currentTarget.disabled = true;
                                changeLike({id: comment.id, action: ((comment.likes && comment.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                    ///e.currentTarget.disabled = false;
                                })
                            }} />
                        </StyledFlex>
                    </StyledBottom>
                </StyledMainStuff>
            </StyledMainStuff>
            }
        </StyledContainer>
    )
};

const StyledEdited = styled.div`
    font-size: 0.8rem;
    align-self: center;
`;

const StyledTop = styled(StyledFlex)`
    gap: 0px;
    justify-content: space-between;
    align-items: center;
`;

const StyledMainStuff = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-grow: 1;
`;

const StyledContainer = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 700px;
    padding: 5px;
    font-size: 1.1rem;
    background-color: rgb(255, 255, 255);
    border: 1px solid black;
`;

const StyledEdit = styled(CommentEdit)`
    flex-grow: 1;
`;

const StyledBottomLeft = styled(StyledFlex)`
    width: 37px;
`;

const StyledCounts = styled.div`
    font-size: 0.9rem;
`;

const StyledLikes = styled.div`
    width: 8px;
    font-size: 0.9rem;
`;

const StyledBottom = styled(StyledFlex)`
    gap: 10px;
`;