import { useSelector } from "react-redux"
import { selectCommentId, selectMyId } from "../features/manager/manager-slice"
import { useChangePostLikeMutation, useGetCommentCommentsInfiniteQuery, useGetCommentQuery } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useNavigate } from "react-router-dom";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import Comment from "./Comment";

export default function CommentPage() {
    const commentId = useSelector(selectCommentId);
    const myId = useSelector(selectMyId)
    const navigate = useNavigate();
    const [ changeLike ] = useChangePostLikeMutation();
    if (!isUUID(commentId)) {
        ///REDIRECT
        navigate("/");
        return;
    }
    const {commentData, isLoading, error } = useGetCommentQuery({id: commentId}, {
        selectFromResult: (result) => ({
            ...result,
            commentData: result.data?.comment
        })
    });

    const {commentsData, isFetchingNextPage, hasNextPage, fetchNextPage  } = useGetCommentCommentsInfiniteQuery(commentId, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });


    return (
        <main>
            { isLoading ? <div>
            Loading Comment...
        </div> : error ? <div>
            Failed Loading Comment!
        </div> : commentData ? 
            <div>
                <div>
                    <div>
                        <img src={commentData.sender.customIcon?.url || commentData.sender.icon.source} alt="" />
                    </div>
                    <div>
                        <div>
                            <div>
                                {commentData.sender.username}
                            </div>
                            <div>
                                {formatRelative(new Date(commentData.sentAt), new Date(), { locale })}
                            </div>
                            <div>
                                {commentData.edited ? "Edited" : ""}
                            </div>
                        </div>
                        <div>
                            {commentData.content}
                        </div>
                        <div>
                            <div>
                                {commentData.ownCommentsCount > 0 ? commentData.ownCommentsCount : ""}
                            </div>
                            <div>
                                {commentData.likesCount > 0 ? commentData.likesCount : ""}
                            </div>
                            { isUUID(myId) &&
                                <button 
                                    {...(commentData.likes ? {style: {backgroundColor: "black"}} : {})}
                                    onClick={(e) => {
                                        e.currentTarget.disabled = true;
                                        changeLike({id: commentData.id, action: (commentData.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                            e.currentTarget.disabled = false;
                                        })
                                    }}
                                >L</button>
                            }
                        </div>
                    </div>
                        {
                            (commentsData && commentsData.length > 0) ? <div>
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
                            </div> : <></>
                        }
                </div>

            </div> : <div>

            </div>
            }
        </main>
    )
}