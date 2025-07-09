import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { useChangeCommentLikeMutation, useGetCommentCommentsInfiniteQuery } from "../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import CommentEdit from "./CommentEdit";
import CommentCreate from "./CommentCreate";
import CommentsDisplayButtons from "./CommentsDisplayButtons";
import LoadMore from "./LoadMore";
import LikeButton from "./LikeButton";
import ShowOptions from "./ShowOptions";
import ClickWrapper from "./ClickWrapper";
import styled, { keyframes } from "styled-components";
import { MessageSquare } from "lucide-react";
import { StyledContent, StyledCounts, StyledEdited, StyledFlex, StyledImage, StyledLoadCSS, StyledMessageImage, StyledUserBlue } from "../../util/style";
import { clickClass } from "../../util/globalValues";

export default function Comment({comment, depth = 0} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike, depth?: number}) {
    const myId = useSelector(selectMyId);
    const [showComments, setShowComments] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [ changeLike ] = useChangeCommentLikeMutation();
    const { commentsData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCommentCommentsInfiniteQuery(showComments ? comment.id : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });

    return (
        <StyledComment>
                <StyledMainComment className="clickOption commentOption" data-commentid={comment.id}>
                    <div className="userOption" data-userid={comment.senderid}>
                        <StyledImage src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
                    </div>
                    <StyledMainStuff>
                        { showEdit ? <CommentEdit comment={comment} changeEdit={() =>  {
                        setShowEdit(false);
                        }} /> :
                        <StyledMainStuff>
                            <StyledTop>
                                <StyledFlex>
                                    <StyledUserBlue className="userOption" data-userid={comment.senderid}>
                                        {comment.sender.username}
                                    </StyledUserBlue>
                                    <StyledEditedDiv>
                                        {formatRelative(new Date(comment.sentAt), new Date(), { locale })}
                                    </StyledEditedDiv>
                                </StyledFlex>
                                <StyledFlex>
                                    <StyledEditedDiv>
                                        {comment.edited ? "Edited" : ""}
                                    </StyledEditedDiv>
                                    <ShowOptions myId={myId} id={comment.senderid} textStuff={{
                                    textId: comment.id,
                                    type: "COMMENT",
                                    editFunc: () =>  setShowEdit(true)
                                    }}  />
                                </StyledFlex>
                            </StyledTop>
                            <div>
                                <StyledContent>
                                    {comment.content}
                                </StyledContent>
                                {comment.image ? <StyledMessageImage className="messageImage" src={comment.image.url} alt="" /> : <></>}
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
                                <StyledBottomRight>
                                    <StyledLikes>
                                        {comment.likesCount > 0 ? comment.likesCount : " "}
                                    </StyledLikes>
                                    <LikeButton myId={myId} likesInfo={comment.likes} clickFunction={(e) => {
                                        ///e.currentTarget.disabled = true;
                                        changeLike({id: comment.id, action: ((comment.likes && comment.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                            ///e.currentTarget.disabled = false;
                                        })
                                    }} />
                                </StyledBottomRight>
                                {isUUID(myId) && <StyledReply className={clickClass} onClick={(e) => {
                                setShowReply(true)
                                }}>Reply</StyledReply>}
                            </StyledBottom>
                        </StyledMainStuff>}
                        <StyledExtraBottom>
                            {
                                showReply && <CommentCreate commentid={comment.id} postid={comment.postid} changeCreate={() =>  setShowReply(false)} />
                            }
                            <CommentsDisplayButtons depth={depth} id={comment.id} count={comment.ownCommentsCount} showing={showComments} setShow={setShowComments}/>
                            {
                                (showComments && commentsData && commentsData.length > 0 ) && <StyledDropDown>
                                    <ClickWrapper>
                                        {
                                            commentsData.map((ele) => {
                                                return <Comment depth={depth + 1} key={ele.id} comment={ele} />
                                            })
                                        }
                                    </ClickWrapper>
                                    <StyledLoad isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                                </StyledDropDown>
                            }
                        </StyledExtraBottom>
                    </StyledMainStuff>
                </StyledMainComment>
        </StyledComment>
    )
};

const StyledComment = styled.div`
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    padding: 5px 0px;
    margin-top: -1px;
    border-bottom: solid 1px black;
    border-top: solid 1px black;
`;

const StyledMainComment = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const StyledTop = styled(StyledFlex)`
    gap: 0px;
    justify-content: space-between;
    align-items: center;
`;

const StyledMainStuff = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StyledBottomLeft = styled(StyledFlex)`
    width: 37px;
`;
const StyledBottomRight = styled(StyledFlex)`
`;

const StyledBottom = styled(StyledFlex)`
    gap: 10px;
`;

const StyledLikes = styled(StyledCounts)`
    width: 8px;
`;

const StyledEditedDiv = styled(StyledEdited)`
    align-self: center;
`;

const StyledReply = styled.button`
    background-color: rgb(231, 250, 255);
    border: 1px solid black;
    font-weight: bold;
    &:hover {
        background-color: rgb(187, 240, 255);
    };
`;

const StyledExtraBottom = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    button:is(.displayOption) {
        align-self: start;
    };
`;

const StyledLoad = styled(LoadMore)`
    $${StyledLoadCSS};
    align-self: center;
`;

const dropAnimation = keyframes`
    0% {
        transform: scaleY(0)
    }
    100% {
        transform: scaleY(1)
    }
`;

const StyledDropDown = styled.div`
    animation: ${dropAnimation} 300ms ease-in-out;
    transform-origin: top center;

`;