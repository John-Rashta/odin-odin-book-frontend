import { useSelector } from "react-redux";
import { selectPostId } from "../features/manager/manager-slice";
import { useGetPostCommentsInfiniteQuery, useGetPostQuery } from "../features/book-api/book-api-slice";
import PostProfile from "./PostProfile";
import Comment from "./Comment";
import CommentCreate from "./CommentCreate";

export default function PostPage() {
    const postId = useSelector(selectPostId);
    const { postData, isLoading, error } = useGetPostQuery({id: postId}, {
         selectFromResult: result => ({
            ...result,
            postData: result.data?.post
        })
    });
    const { commentsData, isLoading: commentsLoading, error: commentsError, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetPostCommentsInfiniteQuery(postId, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });

    return (
        <main>
            {
                isLoading ? <div>
                    Loading Post...
                </div> : error ? <div>
                    Failed Loading Post!
                </div> : postData ? <>
                    <PostProfile post={postData} />
                    <CommentCreate postid={postData.id} />
                    {
                        commentsLoading ? <div>
                            Loading Comments!
                        </div> : commentsError ? <div>
                            Failed Loading Comments!
                        </div> : (commentsData && commentsData.length > 0) ? <div>
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
                        </div> : <div>

                        </div>
                    }
                </> : <div>
                    No Post Yet!
                </div>
            }
        </main>
    )

};