import { useState } from "react";
import { useGetFeedInfiniteQuery } from "../features/book-api/book-api-slice";
import Post from "./Post";
import PostCreate from "./PostCreate";
import { isUUID } from "validator";
import PostEdit from "./PostEdit";
import ClickWrapper from "./ClickWrapper";
import LoadMore from "./LoadMore";
import { StyledDefaultContainer, StyledErrorMessage, StyledLoadCSS, StyledMain, StyledMainContainer } from "../../util/style";
import styled from "styled-components";

export default function Feed() {
    const { postsData, isFetchingNextPage, error, isLoading, hasNextPage, fetchNextPage } = useGetFeedInfiniteQuery(undefined, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({feed}) => feed).flat()
        })
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState("");

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <StyledMain>
            <StyledDefaultContainer>
            <PostCreate />
            {
                isLoading ? <StyledErrorMessage>
                    Loading Feed...
                </StyledErrorMessage> : error ? <StyledErrorMessage>
                    Failed Loading Feed!
                </StyledErrorMessage> : (postsData && postsData.length > 0) ? <StyledPostsContainer>
                    <StyledWrapper>
                    {
                        postsData.map((ele) => {
                            return <Post key={ele.id} info={ele} modalFunc={editFunction} />
                        })
                    }
                    </StyledWrapper>
                    <StyledLoad isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                </StyledPostsContainer> : <StyledErrorMessage>
                    No Feed Yet!
                </StyledErrorMessage>
            }
             {
                (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
            }
            </StyledDefaultContainer>
        </StyledMain>
    )
};

const StyledPostsContainer = styled(StyledMainContainer)`
    width: 100%;
`;

const StyledWrapper = styled(ClickWrapper)`
    width: 100%;
`;

const StyledLoad = styled(LoadMore)`
    ${StyledLoadCSS}
`;