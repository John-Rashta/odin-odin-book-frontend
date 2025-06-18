import { useGetCommentCommentsInfiniteQuery, useGetCommentQuery } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import Comment from "./Comment";
import CommentProfile from "./CommentProfile";
import ClickWrapper from "./ClickWrapper";
import CommentCreate from "./CommentCreate";

export default function CommentPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentId = searchParams.get("id") || "";
    if (!isUUID(currentId)) {
        ///REDIRECT
        navigate("/");
        return;
    };
    const {commentData, isLoading, error } = useGetCommentQuery({id: currentId}, {
        selectFromResult: (result) => ({
            ...result,
            commentData: result.data?.comment
        })
    });

    const {commentsData, isFetchingNextPage, hasNextPage, fetchNextPage  } = useGetCommentCommentsInfiniteQuery(currentId, {
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
                <CommentCreate postid={commentData.postid} commentid={commentData.id} />
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