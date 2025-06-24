import { useState } from "react";
import { useGetFeedInfiniteQuery } from "../features/book-api/book-api-slice";
import Post from "./Post";
import PostCreate from "./PostCreate";
import { isUUID } from "validator";
import PostEdit from "./PostEdit";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";

export default function Feed() {
    const { postsData, isFetchingNextPage, error, isLoading, hasNextPage, fetchNextPage } = useGetFeedInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({feed}) => feed).flat()
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
            <PostCreate />
            {
                isLoading ? <div>
                    Loading Feed...
                </div> : error ? <div>
                    Failed Loading Feed!
                </div> : (postsData && postsData.length > 0) ? <div>
                    <ClickWrapper>
                    {
                        postsData.map((ele) => {
                            return <Post key={ele.id} info={ele} modalFunc={editFunction} />
                        })
                    }
                    </ClickWrapper>
                    <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                </div> : <div>
                    No Feed Yet!
                </div>
            }
             {
                (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
            }
        </main>
    )
};