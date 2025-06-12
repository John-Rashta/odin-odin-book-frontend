import { useState } from "react";
import { useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { useLocation } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import User from "./User";
import ClickWrapper from "./ClickWrapper";

export default function SearchUsers() {
    const possibleSearch = useLocation().state;
    const [searchValue, setSearchValue] = useState(possibleSearch || "");
    const { searchData, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useSearchUsersInfiniteQuery(searchValue !== "" ? searchValue : skipToken, {
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
                    isLoading ? <div>
                        Searching...
                    </div> : error ? <div>
                        Error Searching!
                    </div> : (searchData && searchData.length > 0 && searchValue !== "") ? <div>
                        <ClickWrapper>
                            {
                                searchData.map((ele) => {
                                    return <User key={ele.id} user={ele} />
                                })
                            }
                        </ClickWrapper>
                            {
                                (!isFetchingNextPage && hasNextPage) ? <button onClick={() => fetchNextPage()}>
                                    Load More
                                </button> : <></>
                            }
                    </div> : <div>
                        Try Searching!
                    </div>
                }
            </div>
        </main>
    )
};