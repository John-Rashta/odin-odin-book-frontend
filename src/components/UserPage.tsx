import { useSelector } from "react-redux";
import { useGetUserPostsInfiniteQuery, useGetUserQuery } from "../features/book-api/book-api-slice";
import { selectUserId } from "../features/manager/manager-slice";

export default function UserPage() {
    const userId = useSelector(selectUserId)
    const {} = useGetUserPostsInfiniteQuery(userId,);
    const {} = useGetUserQuery(userId,);

    return (
        <main>
            
        </main>
    )
};