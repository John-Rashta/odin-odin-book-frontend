import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { useGetCommentCommentsInfiniteQuery } from "../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import TextOptions from "./TextOptions";
import { Ellipsis } from "lucide-react";
import CommentEdit from "./CommentEdit";
import ClickWrapper from "./ClickWrapper";

export default function Comment({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const myId = useSelector(selectMyId);
    const [showComments, setShowComments] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [ changeLike ] = useChangePostLikeMutation();
    const { commentsData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCommentCommentsInfiniteQuery(showComments ? comment.id : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });

    return (
        <div>
            { showEdit ? <CommentEdit comment={comment} changeEdit={() =>  setShowEdit(false)} /> :
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
                            {comment.content}
                        </div>
                        <div>
                            <div>
                                {comment.ownCommentsCount > 0 ? comment.ownCommentsCount : ""}
                            </div>
                            <div>
                                {comment.likesCount > 0 ? comment.likesCount : ""}
                            </div>
                            { isUUID(myId) &&
                                <button 
                                    {...(comment.likes ? {style: {backgroundColor: "black"}} : {})}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.disabled = true;
                                        changeLike({id: comment.id, action: (comment.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                            e.currentTarget.disabled = false;
                                        })
                                    }}
                                >L</button>
                            }
                            <div>
                                {
                                    myId === comment.senderid ? <Ellipsis onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOptions(!showOptions);
                                    }} /> : <></>
                                }
                                {
                                showOptions && <TextOptions textId={comment.id} type="COMMENT" editFunc={() =>  setShowEdit(true)} closeFunc={() => setShowOptions(false)} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
            comment.ownCommentsCount > 0 && (showComments ? <button onClick={(e) =>  {
                e.stopPropagation();
                setShowComments(false);
                }}>
                Hide Comments
            </button> : <button onClick={(e) =>  {
                e.stopPropagation();
                setShowComments(true);
                }}>
                Show Comments
            </button>)
            }
            {
                (showComments && commentsData && commentsData.length > 0 ) && <div>
                    <ClickWrapper>
                        {
                            commentsData.map((ele) => {
                                return <Comment key={ele.id} comment={ele} />
                            })
                        }
                    </ClickWrapper>
                    {
                        (!isFetchingNextPage && hasNextPage) ? <button onClick={(e) => {
                            e.stopPropagation();
                            fetchNextPage();
                            }}>
                            Load More
                        </button> : <></>
                    }
                </div>
            }

        </div>
    )
};