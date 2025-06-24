import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { useChangeCommentLikeMutation, useGetCommentCommentsInfiniteQuery } from "../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import TextOptions from "./TextOptions";
import CommentEdit from "./CommentEdit";
import CommentCreate from "./CommentCreate";
import CommentsDisplayButtons from "./CommentsDisplayButtons";
import LoadMore from "./LoadMore";
import LikeButton from "./LikeButton";
import ShowOptions from "./ShowOptions";
import { ButtonClickType } from "../../util/types";

export default function Comment({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const myId = useSelector(selectMyId);
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [ changeLike ] = useChangeCommentLikeMutation();
    const { commentsData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCommentCommentsInfiniteQuery(showComments ? comment.id : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });

    const handleClick = function handleClickButton(e: ButtonClickType) {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };

    return (
        <div>
            { showEdit ? <CommentEdit comment={comment} changeEdit={() =>  {
                setShowEdit(false);
            }} /> :
                <div className="clickOption commentOption" data-commentid={comment.id}>
                    <div className="userOption" data-userid={comment.senderid}>
                        <img src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
                    </div>
                    <div>
                        <div>
                            <div className="userOption" data-userid={comment.senderid}>
                                {comment.sender.username}
                            </div>
                            <div>
                                {formatRelative(new Date(comment.sentAt), new Date(), { locale })}
                            </div>
                            <div>
                                {comment.edited ? "Edited" : ""}
                            </div>
                        </div>
                        <div>
                            <div>
                                {comment.content}
                            </div>
                            {comment.image ? <img src={comment.image.url} alt="" /> : <></>}
                        </div>
                        <div>
                            <div>
                                {comment.ownCommentsCount > 0 ? comment.ownCommentsCount : ""}
                            </div>
                            <div>
                                {comment.likesCount > 0 ? comment.likesCount : ""}
                            </div>
                            <LikeButton myId={myId} likesInfo={comment.likes} clickFunction={(e) => {
                                e.stopPropagation();
                                ///e.currentTarget.disabled = true;
                                changeLike({id: comment.id, action: ((comment.likes && comment.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                    ///e.currentTarget.disabled = false;
                                })
                            }} />
                            <div style={{position: "relative"}}>
                                <ShowOptions myId={myId} id={comment.senderid} clickFunction={handleClick}  />
                                {
                                showOptions && <TextOptions textId={comment.id} type="COMMENT" editFunc={() =>  setShowEdit(true)} closeFunc={() => setShowOptions(false)} />
                                }
                            </div>
                        </div>
                    </div>
                    {isUUID(myId) && <button onClick={(e) => {
                        e.stopPropagation()
                        setShowReply(true)
                    }}>Reply</button>}
                </div>
            }
            {
                showReply && <CommentCreate commentid={comment.id} postid={comment.postid} changeCreate={() =>  setShowReply(false)} />
            }
            <CommentsDisplayButtons count={comment.ownCommentsCount} showing={showComments} setShow={setShowComments}/>
            {
                (showComments && commentsData && commentsData.length > 0 ) && <div>
                    <div>
                        {
                            commentsData.map((ele) => {
                                return <Comment key={ele.id} comment={ele} />
                            })
                        }
                    </div>
                    <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                </div>
            }

        </div>
    )
};