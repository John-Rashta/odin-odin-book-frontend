import { useSelector } from "react-redux";
import { useGetUserPostsInfiniteQuery, useGetUserQuery } from "../features/book-api/book-api-slice";
import { selectUserId } from "../features/manager/manager-slice";
import UserProfile from "./UserProfile";
import Post from "./Post";

export default function UserPage() {
    const userId = useSelector(selectUserId)
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
                            {postsData.map((ele) => {
                                return <Post key={ele.id} info={ele}/>
                            })}
                            {
                                (!isFetchingNextPage && hasNextPage) ? <button onClick={() => fetchNextPage()}>
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
        </main>
    )
};