import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { ModalStartFunction } from "../../util/types";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import ShowOptions from "./ShowOptions";
import LikeButton from "./LikeButton";
import styled from "styled-components";
import { StyledImage, StyledMessageImage, StyledUserBlue, StyledContent, StyledFlex, StyledCounts, StyledEdited } from "../../util/style";

export default function Post({info, modalFunc} : {info: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    
    return (
        <StyledContainer className="clickOption postOption" data-postid={info.id}>
            <div>
                <StyledImage className="userOption" data-userid={info.creator.id} src={info.creator.customIcon?.url || info.creator.icon.source} alt="" />
            </div>
            <MainContainer>
                <TopContainer>
                    <StyledFlex>
                        <StyledUserBlue className="userOption" data-userid={info.creator.id}>
                        {info.creator.username}
                        </StyledUserBlue>   
                        <StyledEdited>
                            {formatRelative(new Date(info.createdAt), new Date(), { locale })}
                        </StyledEdited>
                    </StyledFlex>
                    <TopRightContainer>
                        <StyledEdited>
                            {info.edited? "Edited" : ""}
                        </StyledEdited>
                        {
                        typeof modalFunc === "function" && <ShowOptions myId={myId} id={info.creatorid} textStuff={{
                            textId: info.id,
                            type: "POST",
                            editFunc: modalFunc
                        }} />
                        }
                    </TopRightContainer>
                </TopContainer>
                <div>
                    <StyledContent>
                        {info.content}
                    </StyledContent>
                    {info.image ? <StyledMessageImage className="messageImage" src={info.image.url} alt="" /> : <></>}
                </div>
                <BottomContainer>
                    <StyledFlex>
                        <StyledCounts>
                            {info.ownCommentsCount}
                        </StyledCounts>
                        <MessageSquare />
                    </StyledFlex>
                    <BottomRightContainer>
                        <StyledCounts>
                            {info.likesCount}
                        </StyledCounts>
                        <LikeButton myId={myId} likesInfo={info.likes} clickFunction={(e) => {
                            ///e.currentTarget.disabled = true;
                            changeLike({id: info.id, action: ((info.likes && info.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                            ///e.currentTarget.disabled = false;
                            })
                        }}/>
                    </BottomRightContainer>
                </BottomContainer>

            </MainContainer>
        </StyledContainer>
    )
};

const StyledContainer = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 5px;
    margin-top: -1px;
    border-bottom: solid 1px black;
    border-top: solid 1px black;
    &:hover {
        background-color: rgb(228, 245, 255);
    }
`;

const TopRightContainer = styled.div`
    display: flex;
    gap: 3px;
`;

const TopContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
`;

const BottomContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const BottomRightContainer = styled(StyledFlex)`
    align-items: center;
`;

const MainContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;