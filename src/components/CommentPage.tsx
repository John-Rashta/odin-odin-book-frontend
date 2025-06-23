import { useGetCommentCommentsInfiniteQuery, useGetCommentQuery } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useSearchParams } from "react-router-dom";
import Comment from "./Comment";
import CommentProfile from "./CommentProfile";
import ClickWrapper from "./ClickWrapper";
import CommentCreate from "./CommentCreate";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "./BackButton";

export default function CommentPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const myId = useSelector(selectMyId);
    const currentId = searchParams.get("id") || "";
    const {commentData, isLoading, error } = useGetCommentQuery({id: currentId}, {
        selectFromResult: (result) => ({
            ...result,
            commentData: result.data?.comment
        })
    });

    const {commentsData, isFetchingNextPage, hasNextPage, fetchNextPage  } = useGetCommentCommentsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
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
            Can't Find Comment.
        </div> : commentData ? 
            <div>
                <BackButton />
                <CommentProfile comment={commentData} />
                {isUUID(myId) && <CommentCreate postid={commentData.postid} commentid={commentData.id} />}
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