import { useSelector } from "react-redux";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { ButtonClickType, ModalStartFunction } from "../../util/types";
import { useState } from "react";
import TextOptions from "./TextOptions";
import ShowOptions from "./ShowOptions";
import LikeButton from "./LikeButton";
import ClickWrapper from "./ClickWrapper";

export default function PostProfile({post, modalFunc} : {post: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    const [showOptions, setShowOptions] = useState(false);

    const handleClick = function handleClickingButton(e: ButtonClickType) {
        e.stopPropagation();
        setShowOptions(!showOptions);
    };

    return (
        <div>
            <ClickWrapper>
                <img className="clickOption userOption" data-userid={post.creator.id} src={post.creator.customIcon?.url || post.creator.icon.source} alt="" />
                <div className="clickOption userOption" data-userid={post.creator.id}>
                    {post.creator.username}
                </div>
            </ClickWrapper>
            <div>
                <div>
                    <div>
                        {post.content}
                    </div>
                    {post.image ? <img src={post.image.url} alt="" /> : <></>}
                </div>
                <div>
                    {post.likesCount}
                </div>
                <div>
                    {post.ownCommentsCount}
                </div>
                <div>
                    {post.edited ? "Edited" : ""}
                </div>
                <div>
                   {formatRelative(new Date(post.createdAt), new Date(), { locale })}
                </div>
                <LikeButton myId={myId} likesInfo={post.likes} clickFunction={(e) => {
                    e.stopPropagation();
                    ///e.currentTarget.disabled = true;
                    changeLike({id: post.id, action: ((post.likes && post.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                    ///e.currentTarget.disabled = false;
                    })
                }} />
                <ShowOptions myId={myId} id={post.creatorid} clickFunction={handleClick} />
                {
                (showOptions && typeof modalFunc === "function") && <TextOptions textId={post.id} type="POST" editFunc={modalFunc} closeFunc={() => setShowOptions(false)} />
                }
            </div>
        </div>
    )
};