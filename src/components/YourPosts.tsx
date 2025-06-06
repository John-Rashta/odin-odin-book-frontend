import { useSelector } from "react-redux";
import { useGetMyPostsInfiniteQuery } from "../features/book-api/book-api-slice";
import { selectMyId } from "../features/manager/manager-slice";
import Post from "./Post";

export default function YourPosts() {
    const myId = useSelector(selectMyId);
    const { postsData, isFetchingNextPage, error, isLoading, hasNextPage, fetchNextPage } = useGetMyPostsInfiniteQuery(myId, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({posts}) => posts).flat()
        })
    });

    return (
        <main>
            {
                isLoading ? <div>
                    Loading Your Posts...
                </div> : error ? <div>
                    Failed Loading Posts!
                </div> : (postsData && postsData.length > 0 ) ? <div>
                    <div>
                        {
                            postsData.map((ele) => {
                                return <Post key={ele.id} info={ele} />
                            })
                        }
                    </div>
                        {
                            (!isFetchingNextPage && hasNextPage) ? <button onClick={() => fetchNextPage()}>
                                Load More
                            </button> : <></>
                        }
                </div> : <div>
                    No Posts Yet!
                </div>
            }
        </main>
    )
};