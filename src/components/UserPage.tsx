import { useSelector } from "react-redux";
import { useGetUserPostsInfiniteQuery, useGetUserQuery } from "../features/book-api/book-api-slice";
import { selectUserId } from "../features/manager/manager-slice";
import UserProfile from "./UserProfile";
import Post from "./Post";
import { useState } from "react";
import PostEdit from "./PostEdit";
import { isUUID } from "validator";
import ClickWrapper from "./ClickWrapper";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "./BackButton";
import LoadMore from "./LoadMore";
import { StyledDefaultContainer, StyledErrorMessage, StyledLoadCSS, StyledMain, StyledMainContainer } from "../../util/style";
import styled from "styled-components";

export default function UserPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentId = searchParams.get("id") || "";
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState("");
    const {postsData, error: postsError, isLoading: postsLoading, isFetchingNextPage, hasNextPage, fetchNextPage} = useGetUserPostsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
        selectFromResult: result => ({
            ...result,
            postsData: result.data?.pages.map(({posts}) => posts).flat()
        })
    });
    const {userData, error, isLoading} = useGetUserQuery(currentId, {
        selectFromResult: result => ({
            ...result,
            userData: result.data?.user
        })
    });

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <StyledMain>
            <StyledDefault>
            {
                isLoading ? <StyledErrorMessage>
                    Loading User...
                </StyledErrorMessage> : error ? <StyledErrorMessage>
                    Can't Find User.
                </StyledErrorMessage> : userData ? <>
                    <StyledBack />
                    <UserProfile info={userData} />
                    {
                        postsLoading ? <StyledErrorMessage>
                            Loading Posts...
                        </StyledErrorMessage> : error ? <StyledErrorMessage>
                            Failed Loading Posts!
                        </StyledErrorMessage> : (postsData && postsData.length > 0) ? <StyledPostsContainer>
                            <StyledWrapper>
                                {postsData.map((ele) => {
                                    return <Post key={ele.id} info={ele} modalFunc={editFunction}/>
                                })}
                            </StyledWrapper>
                            <StyledLoad isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                        </StyledPostsContainer> : <StyledErrorMessage>
                            No Posts Yet!
                        </StyledErrorMessage>
                    }
                </> : <StyledErrorMessage>
                    No User Yet!
                </StyledErrorMessage>
            }
            {
                (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
            }
            </StyledDefault>
        </StyledMain>
    )
};

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
    align-self: start;
    border: none;
    cursor: pointer;
    background-color: transparent;
    &:hover {
       background-color: rgb(121, 192, 255);
    }
`;