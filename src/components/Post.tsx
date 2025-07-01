import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { isUUID } from "validator";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { ButtonClickType, ModalStartFunction } from "../../util/types";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import TextOptions from "./TextOptions";
import ShowOptions from "./ShowOptions";
import LikeButton from "./LikeButton";
import styled from "styled-components";

export default function Post({info, modalFunc} : {info: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    const [showOptions, setShowOptions] = useState(false);

    const handleClick = function handleClickingButton(e: ButtonClickType) {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };
    
    return (
        <StyledContainer className="clickOption postOption" data-postid={info.id}>
            <div>
                <img className="userOption" data-userid={info.creator.id} src={info.creator.customIcon?.url || info.creator.icon.source} alt="" />
            </div>
            <div>
                <TopContainer>
                    <TopLeftContainer>
                        <div className="userOption" data-userid={info.creator.id}>
                        {info.creator.username}
                        </div>
                        <div>
                            {formatRelative(new Date(info.createdAt), new Date(), { locale })}
                        </div>
                    </TopLeftContainer>
                    <TopRightContainer>
                        <div>
                            {info.edited? "Edited" : ""}
                        </div>
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
                    <div {...{style: {whiteSpace: "pre-line"}}}>
                        {info.content}
                    </div>
                    {info.image ? <img src={info.image.url} alt="" /> : <></>}
                </div>
                <BottomContainer>
                    <div>
                        {info.ownCommentsCount}
                    </div>
                    <BottomRightContainer>
                        <div>
                            {info.likesCount}
                        </div>
                        <LikeButton myId={myId} likesInfo={info.likes} clickFunction={(e) => {
                            e.stopPropagation();
                            ///e.currentTarget.disabled = true;
                            changeLike({id: info.id, action: ((info.likes && info.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                            ///e.currentTarget.disabled = false;
                            })
                        }}/>
                    </BottomRightContainer>
                </BottomContainer>

            </div>
        </StyledContainer>
    )
};

const StyledContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const TopLeftContainer = styled.div`
    display: flex;
    gap: 5px;
`;

const TopRightContainer = styled.div`
    display: flex;
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

const BottomRightContainer = styled.div`
    display: flex;
    align-items: center;
`;