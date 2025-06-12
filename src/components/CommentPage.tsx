import { useSelector } from "react-redux"
import { selectCommentId } from "../features/manager/manager-slice"
import { useGetCommentCommentsInfiniteQuery, useGetCommentQuery } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import CommentProfile from "./CommentProfile";
import ClickWrapper from "./ClickWrapper";

export default function CommentPage() {
    const commentId = useSelector(selectCommentId);
    const navigate = useNavigate();
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
                <CommentProfile comment={commentData} />
                <div>
                        {
                            (commentsData && commentsData.length > 0) ? <div>
                                <ClickWrapper>
                                    {
                                        commentsData.map((ele) => {
                                            return <Comment key={ele.id} comment={ele} />
                                        })
                                    }
                                </ClickWrapper>
                                 {
                                    (!isFetchingNextPage && hasNextPage) ? <button onClick={(e) =>{
                                        e.stopPropagation();
                                        fetchNextPage();
                                        }}>
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