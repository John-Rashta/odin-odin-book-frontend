import { useSelector } from "react-redux";
import { selectPostId } from "../features/manager/manager-slice";
import { useGetPostCommentsInfiniteQuery, useGetPostQuery } from "../features/book-api/book-api-slice";
import PostProfile from "./PostProfile";
import Comment from "./Comment";
import CommentCreate from "./CommentCreate";
import { useState } from "react";
import { isUUID } from "validator";
import PostEdit from "./PostEdit";
import ClickWrapper from "./ClickWrapper";

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
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(postId);

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <main>
            {
                isLoading ? <div>
                    Loading Post...
                </div> : error ? <div>
                    Failed Loading Post!
                </div> : postData ? <>
                    <PostProfile post={postData} modalFunc={editFunction}/>
                    <CommentCreate postid={postData.id} />
                    {
                        commentsLoading ? <div>
                            Loading Comments!
                        </div> : commentsError ? <div>
                            Failed Loading Comments!
                        </div> : (commentsData && commentsData.length > 0) ? <div>
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
                        </div> : <div>

                        </div>
                    }
                    {
                        (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
                    }
                </> : <div>
                    No Post Yet!
                </div>
            }

        </main>
    )

};