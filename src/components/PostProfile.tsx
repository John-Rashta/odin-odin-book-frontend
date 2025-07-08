import { useSelector } from "react-redux";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { ClickType, ModalStartFunction } from "../../util/types";
import { useState } from "react";
import ShowOptions from "./ShowOptions";
import LikeButton from "./LikeButton";
import { useNavigate } from "react-router-dom";
import { StyledDivFlex, StyledImage, StyledMessageImage, StyledUserBlue, StyledFlex, StyledContent, StyledEdited, StyledCounts } from "../../util/style";
import { MessageSquare } from "lucide-react";
import styled from "styled-components";
import { clickClass } from "../../util/globalValues";

export default function PostProfile({post, modalFunc} : {post: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    const [showOptions, setShowOptions] = useState(false);
    const navigate = useNavigate();

    const handleUserClick = function handleClickUser(e: ClickType) {
        navigate(`/user?id=${post.creator.id}`);
    };

    return (
        <StyledContainer>
            <div>
                <StyledPostImage className={clickClass} onClick={handleUserClick} src={post.creator.customIcon?.url || post.creator.icon.source} alt="" />
            </div>
            <StyledMainStuff>
                <StyledTopContainer>
                    <StyledFlex>
                        <StyledUserBlue className={clickClass} onClick={handleUserClick}>
                            {post.creator.username}
                        </StyledUserBlue>
                        <StyledEditedDiv>
                            {formatRelative(new Date(post.createdAt), new Date(), { locale })}
                        </StyledEditedDiv>
                    </StyledFlex>
                    <StyledTopRight>
                        <StyledEditedDiv>
                            {post.edited ? "Edited" : ""}
                        </StyledEditedDiv>
                        {
                        typeof modalFunc === "function" &&  <ShowOptions myId={myId} id={post.creatorid} textStuff={{
                            textId: post.id,
                            type: "POST",
                            editFunc: modalFunc,
                        }} />
                        }
                    </StyledTopRight>
                </StyledTopContainer>
                <div>
                    <StyledContent>
                        {post.content}
                    </StyledContent>
                    {post.image ? <StyledMessageImage className="messageImage" src={post.image.url} alt="" /> : <></>}
                </div>
                <BottomContainer>
                    <StyledFlex>
                        <StyledCounts>
                            {post.ownCommentsCount}
                        </StyledCounts>
                        <MessageSquare/>
                    </StyledFlex>
                    <BottomRightContainer>
                        <StyledCounts>
                            {post.likesCount}
                        </StyledCounts>
                        <LikeButton myId={myId} likesInfo={post.likes} clickFunction={(e) => {
                            ///e.currentTarget.disabled = true;
                            changeLike({id: post.id, action: ((post.likes && post.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                            ///e.currentTarget.disabled = false;
                            })
                        }} />
                    </BottomRightContainer>
                </BottomContainer>
            </StyledMainStuff>
        </StyledContainer>
    )
};

const StyledContainer = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 700px;
    padding: 5px;
    font-size: 1.1rem;
    background-color: rgb(255, 255, 255);
    border: 1px solid black;
`;

const StyledTopRight = styled(StyledFlex)`
    gap: 3px;
`;

const StyledTopContainer = styled(StyledFlex)`
    gap: 10px;
    justify-content: space-between;
    align-items:center;
`;

const StyledMainStuff = styled(StyledDivFlex)`
    flex-grow: 1;
    gap: 30px;
`;

const StyledEditedDiv = styled(StyledEdited)`
    align-self: center;
`;

const BottomContainer = styled(StyledFlex)`
    justify-content: space-between;
    gap: 0px;
`;

const BottomRightContainer = styled(StyledFlex)`
    align-items: center;
`;

const StyledPostImage = styled(StyledImage)`
    width: 60px !important;
    height: 60px !important;
`;


