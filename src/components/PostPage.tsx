import { useGetPostCommentsInfiniteQuery, useGetPostQuery } from "../features/book-api/book-api-slice";
import PostProfile from "./PostProfile";
import Comment from "./Comment";
import CommentCreate from "./CommentCreate";
import { useState } from "react";
import { isUUID } from "validator";
import PostEdit from "./PostEdit";
import ClickWrapper from "./ClickWrapper";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "./BackButton";
import LoadMore from "./LoadMore";

export default function PostPage() {
    const myId = useSelector(selectMyId);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentId = searchParams.get("id") || "";
    const { postData, isLoading, error } = useGetPostQuery({id: currentId}, {
         selectFromResult: result => ({
            ...result,
            postData: result.data?.post
        })
    });
    const { commentsData, isLoading: commentsLoading, error: commentsError, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetPostCommentsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(currentId);

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
                    Can't Find Post.
                </div> : postData ? <>
                    <BackButton />
                    <PostProfile post={postData} modalFunc={editFunction}/>
                    {isUUID(myId) && <CommentCreate postid={postData.id} />}
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
                            <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
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