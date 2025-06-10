import { useGetFeedInfiniteQuery } from "../features/book-api/book-api-slice";
import Post from "./Post";
import PostCreate from "./PostCreate";

export default function Feed() {
    const { postsData, isFetchingNextPage, error, isLoading, hasNextPage, fetchNextPage } = useGetFeedInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({feed}) => feed).flat()
        })
    });

    return (
        <main>
            {
                isLoading ? <div>
                    Loading Feed...
                </div> : error ? <div>
                    Failed Loading Feed!
                </div> : (postsData && postsData.length > 0) ? <div>
                    <PostCreate />
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
                    No Feed Yet!
                </div>
            }
        </main>
    )
};