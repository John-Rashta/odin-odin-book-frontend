import { useState } from "react";
import { useGetFollowersInfiniteQuery, useGetFollowsInfiniteQuery } from "../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import User from "./User";

export default function Followships() {
    const [selectedType, setSelectedType] = useState("FOLLOWS");
    const { followsData, error: followsError, isLoading: followsLoading, hasNextPage: hasNextFollow, isFetchingNextPage: isFetchingFollowNext, fetchNextPage: fetchNextFollow } = useGetFollowsInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            followsData: result.data?.pages.map(({follows}) => follows).flat()
        })
    });
    const { followersData, error: followersError, isLoading: followersLoading, hasNextPage: hasNextFollower, isFetchingNextPage: isFetchingFollowerNext, fetchNextPage: fetchNextFollower } = useGetFollowersInfiniteQuery(selectedType === "FOLLOWERS" ? undefined : skipToken, {
        selectFromResult: result => ({
            ...result,
            followersData: result.data?.pages.map(({followers}) => followers).flat()
        })
    });

    return (
        <main>
            <div>
                <button onClick={() =>  setSelectedType("FOLLOWS")}>Follows</button>
                <button onClick={() => setSelectedType("FOLLOWERS")}>Followers</button>
            </div>
            <div>
                {
                    selectedType === "FOLLOWERS" && (
                        followersLoading ? <div>
                            Loading Followers...
                        </div> : followersError ? <div>
                            Failed Loading Followers!
                        </div> : (followersData && followersData.length > 0) ? <div>
                            <div>
                            {
                                followersData.map((ele) => {
                                return <User key={ele.id} user={ele} />
                                })
                            }
                            </div>
                            {
                                (!isFetchingFollowerNext && hasNextFollower) ? <button onClick={() => fetchNextFollower()}>
                                    Load More
                                </button> : <></>
                            }
                        </div> : <div>
                            No Followers Yet!
                        </div>
                     ) || (
                        followsLoading ? <div>
                            Loading Follows...
                        </div> : followsError ? <div>
                            Failed Loading Follows!
                        </div> : (followsData && followsData.length > 0) ? <div>
                            <div>
                            {
                                followsData.map((ele) => {
                                    return <User key={ele.id} user={ele} />
                                })
                            }
                            </div>
                            {
                                (!isFetchingFollowNext && hasNextFollow) ? <button onClick={() => fetchNextFollow()}>
                                    Load More
                                </button> : <></>
                            }
                        </div> : <div>
                            No Follows Yet!
                        </div>

                     )
                }
            </div>
        </main>
    )

};