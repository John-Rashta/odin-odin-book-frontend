import { useSelector } from "react-redux";
import { useGetUserPostsInfiniteQuery, useGetUserQuery } from "../features/book-api/book-api-slice";
import { selectUserId } from "../features/manager/manager-slice";
import UserProfile from "./UserProfile";
import Post from "./Post";
import { useState } from "react";
import PostEdit from "./PostEdit";
import { isUUID } from "validator";
import ClickWrapper from "./ClickWrapper";

export default function UserPage() {
    const userId = useSelector(selectUserId);
     const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState("");
    const {postsData, error: postsError, isLoading: postsLoading, isFetchingNextPage, hasNextPage, fetchNextPage} = useGetUserPostsInfiniteQuery(userId, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({posts}) => posts).flat()
        })
    });
    const {userData, error, isLoading} = useGetUserQuery(userId, {
        selectFromResult: result => ({
            ...result,
            userData: result.data?.user
        })
    });

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <main>
            {
                isLoading ? <div>
                    Loading User...
                </div> : error ? <div>
                    Failed Loading User!
                </div> : userData ? <>
                    <UserProfile info={userData} />
                    {
                        postsLoading ? <div>
                            Loading Posts...
                        </div> : error ? <div>
                            Failed Loading Posts!
                        </div> : (postsData && postsData.length > 0) ? <div>
                            <ClickWrapper>
                                {postsData.map((ele) => {
                                    return <Post key={ele.id} info={ele} modalFunc={editFunction}/>
                                })}
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
                            No Posts Yet!
                        </div>
                    }
                </> : <div>
                    No User Yet!
                </div>
            }
        {
            (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
        }
        </main>
    )
};