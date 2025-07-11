import { useState } from "react";
import {
  useGetFollowersInfiniteQuery,
  useGetFollowsInfiniteQuery,
} from "../../features/book-api/book-api-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import User from "../partials/user/User";
import ClickWrapper from "../partials/wrappers/ClickWrapper";
import LoadMore from "../partials/buttons/LoadMore";
import {
  StyledDefaultContainer,
  StyledMain,
  StyledErrorMessage,
  StyledMainContainer,
  StyledClickButton,
} from "../../../util/style";
import styled from "styled-components";
import { clickClass } from "../../../util/globalValues";

export default function Followships() {
  const [selectedType, setSelectedType] = useState("FOLLOWS");
  const {
    followsData,
    error: followsError,
    isLoading: followsLoading,
    hasNextPage: hasNextFollow,
    isFetchingNextPage: isFetchingFollowNext,
    fetchNextPage: fetchNextFollow,
  } = useGetFollowsInfiniteQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      followsData: result.data?.pages.map(({ follows }) => follows).flat(),
    }),
  });
  const {
    followersData,
    error: followersError,
    isLoading: followersLoading,
    hasNextPage: hasNextFollower,
    isFetchingNextPage: isFetchingFollowerNext,
    fetchNextPage: fetchNextFollower,
  } = useGetFollowersInfiniteQuery(
    selectedType === "FOLLOWERS" ? undefined : skipToken,
    {
      selectFromResult: (result) => ({
        ...result,
        followersData: result.data?.pages
          .map(({ followers }) => followers)
          .flat(),
      }),
    },
  );

  return (
    <StyledMain>
      <StyledDefaultContainer>
        <StyledButtonsContainer className={clickClass}>
          <StyledButtons
            $trueType="FOLLOWS"
            $currentType={selectedType}
            onClick={() => setSelectedType("FOLLOWS")}
          >
            Follows
          </StyledButtons>
          <StyledButtons
            $trueType="FOLLOWERS"
            $currentType={selectedType}
            onClick={() => setSelectedType("FOLLOWERS")}
          >
            Followers
          </StyledButtons>
        </StyledButtonsContainer>
        <StyledContainer>
          {(selectedType === "FOLLOWERS" &&
            (followersLoading ? (
              <StyledErrorMessage>Loading Followers...</StyledErrorMessage>
            ) : followersError ? (
              <StyledErrorMessage>Failed Loading Followers!</StyledErrorMessage>
            ) : followersData && followersData.length > 0 ? (
              <StyledContainer>
                <StyledWrapper>
                  {followersData.map((ele) => {
                    return <User key={ele.id} user={ele} />;
                  })}
                </StyledWrapper>
                <LoadMore
                  isFetchingNextPage={isFetchingFollowerNext}
                  hasNextPage={hasNextFollower}
                  fetchNextPage={fetchNextFollower}
                />
              </StyledContainer>
            ) : (
              <StyledErrorMessage>No Followers Yet!</StyledErrorMessage>
            ))) ||
            (followsLoading ? (
              <StyledErrorMessage>Loading Follows...</StyledErrorMessage>
            ) : followsError ? (
              <StyledErrorMessage>Failed Loading Follows!</StyledErrorMessage>
            ) : followsData && followsData.length > 0 ? (
              <StyledContainer>
                <StyledWrapper>
                  {followsData.map((ele) => {
                    return <User key={ele.id} user={ele} />;
                  })}
                </StyledWrapper>
                <LoadMore
                  isFetchingNextPage={isFetchingFollowNext}
                  hasNextPage={hasNextFollow}
                  fetchNextPage={fetchNextFollow}
                />
              </StyledContainer>
            ) : (
              <StyledErrorMessage>No Follows Yet!</StyledErrorMessage>
            ))}
        </StyledContainer>
      </StyledDefaultContainer>
    </StyledMain>
  );
}

const StyledButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const StyledButtons = styled(StyledClickButton)``;

const StyledContainer = styled(StyledMainContainer)`
  width: 100%;
`;

const StyledWrapper = styled(ClickWrapper)`
  width: 100%;
`;
