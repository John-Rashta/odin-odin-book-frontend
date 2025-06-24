import { useState } from "react";
import { useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import User from "./User";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";

export default function SearchUsers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("user") || "");
    const { searchData, isLoading, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage } = useSearchUsersInfiniteQuery(searchValue !== "" ? searchValue : skipToken, {
        selectFromResult: result => ({
            ...result,
            searchData: result.data?.pages.map(({users}) => users).flat()
        })
    });

    return (
        <main>
            <div>
                <input 
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
            </div>
            <div>
                {
                     (searchData && searchData.length > 0 && searchValue !== "") ? <div>
                        <ClickWrapper>
                            {
                                searchData.map((ele) => {
                                    return <User key={ele.id} user={ele} />
                                })
                            }
                        </ClickWrapper>
                        <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                    </div> : <div>
                        Try Searching!
                    </div>
                }
            </div>
        </main>
    )
};