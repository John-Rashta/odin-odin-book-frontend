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

export default function Comment({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const myId = useSelector(selectMyId);
    const [showComments, setShowComments] = useState(false);
    const [ changeLike ] = useChangePostLikeMutation();
    const { commentsData, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCommentCommentsInfiniteQuery(showComments ? comment.id : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });

    return (
        <div>
            <div>
                <div>
                    <img src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
                </div>
                <div>
                    <div>
                        <div>
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
                                    e.currentTarget.disabled = true;
                                    changeLike({id: comment.id, action: (comment.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                        e.currentTarget.disabled = false;
                                    })
                                }}
                            >L</button>
                        }
                    </div>
                </div>

            </div>
            {
            comment.ownCommentsCount > 0 && (showComments ? <button onClick={() =>  setShowComments(false)}>
                Hide Comments
            </button> : <button onClick={() =>  setShowComments(true)}>
                Show Comments
            </button>)
            }
            {
                (showComments && commentsData && commentsData.length > 0 ) && <div>
                    <div>
                        {
                            commentsData.map((ele) => {
                                return <Comment key={ele.id} comment={ele} />
                            })
                        }
                    </div>
                    {
                        (!isFetchingNextPage && hasNextPage) ? <button onClick={() => fetchNextPage()}>
                            Load More
                        </button> : <></>
                    }
                </div>
            }

        </div>
    )
};