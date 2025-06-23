import { SimpleFunctionType } from "../../util/types";

export default function LoadMore({isFetchingNextPage, hasNextPage, fetchNextPage} : {isFetchingNextPage: boolean, hasNextPage: boolean, fetchNextPage: SimpleFunctionType}) {
    return (
        <>
            {
                (!isFetchingNextPage && hasNextPage) && <button onClick={(e) => {
                    e.stopPropagation();
                    fetchNextPage();
                    }}>
                    Load More
                </button>
            }
        </>
    )
};