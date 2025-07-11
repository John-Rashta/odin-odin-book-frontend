import { useState } from "react";
import { useGetFeedInfiniteQuery } from "../../features/book-api/book-api-slice";
import Post from "../partials/post/Post";
import PostCreate from "../partials/post/PostCreate";
import { isUUID } from "validator";
import PostEdit from "../partials/post/PostEdit";
import ClickWrapper from "../partials/wrappers/ClickWrapper";
import LoadMore from "../partials/buttons/LoadMore";
import {
  StyledDefaultContainer,
  StyledErrorMessage,
  StyledLoadCSS,
  StyledMain,
  StyledMainContainer,
} from "../../../util/style";
import styled from "styled-components";

export default function Feed() {
  const {
    postsData,
    isFetchingNextPage,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetFeedInfiniteQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsData: result.data?.pages.map(({ feed }) => feed).flat(),
    }),
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
        <PostCreate placeName="Share your thoughts..." />
        {isLoading ? (
          <StyledErrorMessage>Loading Feed...</StyledErrorMessage>
        ) : error ? (
          <StyledErrorMessage>Failed Loading Feed!</StyledErrorMessage>
        ) : postsData && postsData.length > 0 ? (
          <StyledPostsContainer>
            <StyledWrapper>
              {postsData.map((ele) => {
                return (
                  <Post key={ele.id} info={ele} modalFunc={editFunction} />
                );
              })}
            </StyledWrapper>
            <StyledLoad
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </StyledPostsContainer>
        ) : (
          <StyledErrorMessage>No Feed Yet!</StyledErrorMessage>
        )}
      </StyledDefaultContainer>
      {showModal && isUUID(editId) && (
        <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
      )}
    </StyledMain>
  );
}

const StyledPostsContainer = styled(StyledMainContainer)`
  width: 100%;
`;

const StyledWrapper = styled(ClickWrapper)`
  width: 100%;
`;

const StyledLoad = styled(LoadMore)`
  ${StyledLoadCSS}
`;
