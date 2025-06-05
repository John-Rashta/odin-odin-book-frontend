import { useGetUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import User from "./User";

export default function Users() {
    const {usersData, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage} = useGetUsersInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            usersData: result.data?.pages.map(({users}) => users).flat()
        })
    });

    return (
        <main>
            {isLoading ? <div>
                Loading Users...
            </div> : error ? <div>
                Failed Loading Users...
            </div> : (usersData && usersData.length > 0) ? <div>
                <div>
                    {usersData.map((ele) => {
                        return <User key={ele.id} user={ele} />
                    })}
                </div>
                {
                    (!isFetchingNextPage && hasNextPage) ? <button onClick={() => fetchNextPage()}>
                        Load More
                    </button> : <></>
                }
            </div> : <div>
                No Users Yet!
            </div>}
        </main>
    )
};