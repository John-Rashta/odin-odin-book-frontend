import { useGetCommentCommentsInfiniteQuery, useGetCommentQuery } from "../features/book-api/book-api-slice";
import { isUUID } from "validator";
import { useSearchParams } from "react-router-dom";
import Comment from "./Comment";
import CommentProfile from "./CommentProfile";
import ClickWrapper from "./ClickWrapper";
import CommentCreate from "./CommentCreate";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { skipToken } from "@reduxjs/toolkit/query";
import BackButton from "./BackButton";
import LoadMore from "./LoadMore";
import styled from "styled-components";
import { StyledBackCSS, StyledDefaultContainer, StyledErrorMessage, StyledLoadCSS, StyledMain, StyledMainContainer } from "../../util/style";

export default function CommentPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const myId = useSelector(selectMyId);
    const currentId = searchParams.get("id") || "";
    const {commentData, isLoading, error } = useGetCommentQuery({id: currentId}, {
        selectFromResult: (result) => ({
            ...result,
            commentData: result.data?.comment
        })
    });

    const {commentsData, isFetchingNextPage, hasNextPage, fetchNextPage  } = useGetCommentCommentsInfiniteQuery(isUUID(currentId) ? currentId : skipToken, {
         selectFromResult: result => ({
            ...result,
            commentsData: result.data?.pages.map(({comments}) => comments).flat()
        })
    });


    return (
        <StyledMain>
            <StyledDefault>
            { isLoading ? <StyledErrorMessage>
            Loading Comment...
        </StyledErrorMessage> : error ? <StyledErrorMessage>
            Can't Find Comment.
        </StyledErrorMessage> : commentData ? 
            <>
                <StyledBack />
                <CommentProfile comment={commentData} />
                {isUUID(myId) && <StyledForm postid={commentData.postid} commentid={commentData.id} placeName="Comment here..." />}
                {
                    (commentsData && commentsData.length > 0) ? <StyledCommentsContainer>
                        <StyledWrapper>
                            {
                                commentsData.map((ele) => {
                                    return <Comment key={ele.id} comment={ele} />
                                })
                            }
                        </StyledWrapper>
                        <StyledLoad isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} />
                    </StyledCommentsContainer> : <></>
                }
            </> : <StyledErrorMessage>
                    No Comment Found!
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