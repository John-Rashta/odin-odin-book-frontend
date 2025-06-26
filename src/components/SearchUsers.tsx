import { useState } from "react";
import { useSearchUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import { useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import User from "./User";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";
import { StyledDefaultContainer, StyledErrorMessage, StyledMain } from "../../util/style";
import styled from "styled-components";

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
        <StyledMain>
            <StyledDefaultContainer>
                <StyledInput 
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    placeholder="Username or ID"
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
                <StyledMainStuff>
                    {
                        (searchData && searchData.length > 0 && searchValue !== "") ? <>
                            <StyledWrapper>
                                {
                                    searchData.map((ele) => {
                                        return <User key={ele.id} user={ele} />
                                    })
                                }
                            </StyledWrapper>
                            <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                        </> : <ExtraErrorMessage>
                            Try Searching!
                        </ExtraErrorMessage>
                    }
                </StyledMainStuff>
            </StyledDefaultContainer>
        </StyledMain>
    )
};

const StyledMainStuff = styled.div`
    width: 100%;
`;

const StyledWrapper = styled(ClickWrapper)`
    width: 100%;
`;

const ExtraErrorMessage = styled(StyledErrorMessage)`
    text-align: center;
`;

const StyledInput = styled.input`
    width: 50%;
    padding: 10px;
    font-size: 1.1rem;
`;