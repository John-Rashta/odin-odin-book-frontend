import styled from "styled-components";
import { StyledDefaultContainer, StyledErrorMessage, StyledMain, StyledMainContainer } from "../../util/style";
import { useGetUsersInfiniteQuery } from "../features/book-api/book-api-slice";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";
import User from "./User";

export default function Users() {
    const {usersData, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage} = useGetUsersInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            usersData: result.data?.pages.map(({users}) => users).flat()
        })
    });

    return (
        <StyledMain>
            <StyledDefaultContainer>
                {
                    isLoading ? <StyledErrorMessage>
                        Loading Users...
                    </StyledErrorMessage> : error ? <StyledErrorMessage>
                        Failed Loading Users...
                    </StyledErrorMessage> : (usersData && usersData.length > 0) ? <StyledUsersContainer>
                        <StyledWrapper>
                            {usersData.map((ele) => {
                                return <User key={ele.id} user={ele} />
                            })}
                        </StyledWrapper>
                        <LoadMore isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage}  fetchNextPage={fetchNextPage}/>
                    </StyledUsersContainer> : <StyledErrorMessage>
                        No Users Yet!
                    </StyledErrorMessage>
                }
            </StyledDefaultContainer>
        </StyledMain>
    )
};

const StyledUsersContainer = styled(StyledMainContainer)`
    width: 100%;
`;

const StyledWrapper = styled(ClickWrapper)`
    width: 100%;
`;