import {
  useGetUserPostsInfiniteQuery,
  useGetUserQuery,
} from "../../features/book-api/book-api-slice";
import UserProfile from "./UserProfile";
import Post from "../partials/post/Post";
import { useState } from "react";
import PostEdit from "../partials/post/PostEdit";
import { isUUID } from "validator";
import ClickWrapper from "../partials/wrappers/ClickWrapper";
import { useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "../partials/buttons/BackButton";
import LoadMore from "../partials/buttons/LoadMore";
import {
  StyledBackCSS,
  StyledDefaultContainer,
  StyledErrorMessage,
  StyledLoadCSS,
  StyledMain,
  StyledMainContainer,
} from "../../../util/style";
import styled from "styled-components";

export default function UserPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentId = searchParams.get("id") || "";
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState("");
  const {
    postsData,
    error: postsError,
    isLoading: postsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetUserPostsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      postsData: result.data?.pages.map(({ posts }) => posts).flat(),
    }),
  });
  const { userData, error, isLoading } = useGetUserQuery(currentId, {
    selectFromResult: (result) => ({
      ...result,
      userData: result.data?.user,
    }),
  });

  const editFunction = function editFunctionForModal(id: string) {
    setEditId(id);
    setShowModal(true);
  };

  return (
    <StyledMain>
      <StyledDefault>
        {isLoading ? (
          <StyledErrorMessage>Loading User...</StyledErrorMessage>
        ) : error ? (
          <StyledErrorMessage>Can't Find User.</StyledErrorMessage>
        ) : userData ? (
          <>
            <StyledBack />
            <UserProfile info={userData} />
            {postsLoading ? (
              <StyledErrorMessage>Loading Posts...</StyledErrorMessage>
            ) : postsError ? (
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
          </>
        ) : (
          <StyledErrorMessage>No User Found!</StyledErrorMessage>
        )}
      </StyledDefault>
      {showModal && isUUID(editId) && (
        <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
      )}
    </StyledMain>
  );
}

const StyledPostsContainer = styled(StyledMainContainer)`
  width: 100%;
`;

const StyledDefault = styled(StyledDefaultContainer)`
  gap: 10px;
  padding-top: 0px;
`;

const StyledWrapper = styled(ClickWrapper)`
  width: 100%;
`;

const StyledLoad = styled(LoadMore)`
  ${StyledLoadCSS}
`;

const StyledBack = styled(BackButton)`
  ${StyledBackCSS}
`;
