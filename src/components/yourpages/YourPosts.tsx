import { useSelector } from "react-redux";
import { useGetMyPostsInfiniteQuery } from "../../features/book-api/book-api-slice";
import { selectMyId } from "../../features/manager/manager-slice";
import Post from "../partials/post/Post";
import PostEdit from "../partials/post/PostEdit";
import { useState } from "react";
import { isUUID } from "validator";
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

export default function YourPosts() {
  const myId = useSelector(selectMyId);
  const {
    postsData,
    isFetchingNextPage,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useGetMyPostsInfiniteQuery(myId, {
    selectFromResult: (result) => ({
      ...result,
      postsData: result.data?.pages.map(({ posts }) => posts).flat(),
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
        {isLoading ? (
          <StyledErrorMessage>Loading Your Posts...</StyledErrorMessage>
        ) : error ? (
          <StyledErrorMessage>Failed Loading Posts!</StyledErrorMessage>
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
          <StyledErrorMessage>No Posts Yet!</StyledErrorMessage>
        )}
      </StyledDefaultContainer>
      {showModal && isUUID(editId) && (
        <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
      )}
    </StyledMain>
  );
}

const StyledLoad = styled(LoadMore)`
  ${StyledLoadCSS}
`;

const StyledWrapper = styled(ClickWrapper)`
  width: 100%;
`;

const StyledPostsContainer = styled(StyledMainContainer)`
  width: 100%;
`;
