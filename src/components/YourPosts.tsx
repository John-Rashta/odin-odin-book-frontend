import { useSelector } from "react-redux";
import { useGetMyPostsInfiniteQuery } from "../features/book-api/book-api-slice";
import { selectMyId } from "../features/manager/manager-slice";
import Post from "./Post";
import PostEdit from "./PostEdit";
import { useState } from "react";
import { isUUID } from "validator";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";

export default function YourPosts() {
    const myId = useSelector(selectMyId);
    const { postsData, isFetchingNextPage, error, isLoading, hasNextPage, fetchNextPage } = useGetMyPostsInfiniteQuery(myId, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({posts}) => posts).flat()
        })
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState("");

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <main>
            {
                isLoading ? <div>
                    Loading Your Posts...
                </div> : error ? <div>
                    Failed Loading Posts!
                </div> : (postsData && postsData.length > 0 ) ? <div>
                    <ClickWrapper>
                        {
                            postsData.map((ele) => {
                                return <Post key={ele.id} info={ele} modalFunc={editFunction} />
                            })
                        }
                    </ClickWrapper>
                    <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                </div> : <div>
                    No Posts Yet!
                </div>
            }
            {
                (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
            }
        </main>
    )
};