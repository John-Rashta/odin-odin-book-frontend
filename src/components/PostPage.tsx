import { useGetPostCommentsInfiniteQuery, useGetPostQuery } from "../features/book-api/book-api-slice";
import PostProfile from "./PostProfile";
import Comment from "./Comment";
import CommentCreate from "./CommentCreate";
import { useState } from "react";
import { isUUID } from "validator";
import PostEdit from "./PostEdit";
import ClickWrapper from "./ClickWrapper";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "./BackButton";
import LoadMore from "./LoadMore";
import { StyledBackCSS, StyledDefaultContainer, StyledErrorMessage, StyledLoadCSS, StyledMain, StyledMainContainer } from "../../util/style";
import styled from "styled-components";

export default function PostPage() {
    const myId = useSelector(selectMyId);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentId = searchParams.get("id") || "";
    const { postData, isLoading, error } = useGetPostQuery({id: currentId}, {
         selectFromResult: result => ({
            ...result,
            postData: result.data?.post
        })
    });
    const { commentsData, isLoading: commentsLoading, error: commentsError, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetPostCommentsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(currentId);

    const editFunction = function editFunctionForModal(id: string) {
        setEditId(id);
        setShowModal(true);
    };

    return (
        <StyledMain>
            <StyledDefault>
            {
                isLoading ? <StyledErrorMessage>
                    Loading Post...
                </StyledErrorMessage> : error ? <StyledErrorMessage>
                    Can't Find Post.
                </StyledErrorMessage> : postData ? <>
                    <StyledBack />
                    <PostProfile post={postData} modalFunc={editFunction}/>
                    {isUUID(myId) && <StyledForm placeName="Comment here..." postid={postData.id} />}
                    {
                        commentsLoading ? <StyledErrorMessage>
                            Loading Comments!
                        </StyledErrorMessage> : commentsError ? <StyledErrorMessage>
                            Failed Loading Comments!
                        </StyledErrorMessage> : (commentsData && commentsData.length > 0) ? <StyledCommentsContainer>
                            <StyledWrapper>
                                {
                                    commentsData.map((ele) => {
                                        return <Comment key={ele.id} comment={ele} />
                                    })
                                }
                            </StyledWrapper>
                            <StyledLoad isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                        </StyledCommentsContainer> : <StyledErrorMessage>
                                No Comments Yet!
                        </StyledErrorMessage>
                    }
                    {
                        (showModal && isUUID(editId)) && <PostEdit postid={editId} closeModal={() => setShowModal(false)} />
                    }
                </> : <StyledErrorMessage>
                    No Post Found!
                </StyledErrorMessage>
            }
            </StyledDefault>
        </StyledMain>
    )
};

const StyledDefault = styled(StyledDefaultContainer)`
    max-width: min(100%, 1200px);
    background-color: rgb(187, 236, 255);
    padding-top: 0px;
`;

const StyledWrapper = styled(ClickWrapper)`
    width: 100%;
    background-color: rgb(255, 255, 255);
`;

const StyledCommentsContainer = styled(StyledMainContainer)`
    width: 100%;
`;

const StyledBack = styled(BackButton)`
    ${StyledBackCSS}
`;

const StyledForm = styled(CommentCreate)`
    width: 100%;
    display: flex;
    form {
        width: 70%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    };
`;

const StyledLoad = styled(LoadMore)`
    ${StyledLoadCSS}
`;