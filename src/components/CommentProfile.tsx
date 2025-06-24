import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import CommentEdit from "./CommentEdit";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { useChangeCommentLikeMutation } from "../features/book-api/book-api-slice";
import TextOptions from "./TextOptions";
import LikeButton from "./LikeButton";
import ShowOptions from "./ShowOptions";
import { ButtonClickType } from "../../util/types";
import ClickWrapper from "./ClickWrapper";

export default function CommentProfile({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const [showOptions, setShowOptions] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangeCommentLikeMutation();

    const handleClick = function handleClickingButton(e: ButtonClickType) {
         e.stopPropagation();
        setShowOptions(!showOptions);
    };

    return (
        <>
    {showEdit ? <CommentEdit comment={comment} changeEdit={() =>  {
        setShowEdit(false);
    }} /> :
            <div>
                <ClickWrapper className="clickOption userOption" data-userid={comment.senderid}>
                    <img src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
                </ClickWrapper>
                <div>
                    <div>
                        <ClickWrapper className="clickOption userOption" data-userid={comment.senderid}>
                            {comment.sender.username}
                        </ClickWrapper>
                        <div>
                            {formatRelative(new Date(comment.sentAt), new Date(), { locale })}
                        </div>
                        <div>
                            {comment.edited ? "Edited" : ""}
                        </div>
                    </div>
                    <div>
                        <div>
                            {comment.content}
                        </div>
                        {comment.image ? <img src={comment.image.url} alt="" /> : <></>}
                    </div>
                    <div>
                        <div>
                            {comment.ownCommentsCount > 0 ? comment.ownCommentsCount : ""}
                        </div>
                        <div>
                            {comment.likesCount > 0 ? comment.likesCount : ""}
                        </div>
                        <LikeButton myId={myId} likesInfo={comment.likes} clickFunction={(e) => {
                            e.stopPropagation();
                            ///e.currentTarget.disabled = true;
                            changeLike({id: comment.id, action: ((comment.likes && comment.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                ///e.currentTarget.disabled = false;
                            })
                        }} />
                        <div>
                            <ShowOptions myId={myId} id={comment.senderid} clickFunction={handleClick} />
                            {
                            showOptions && <TextOptions textId={comment.id} type="COMMENT" editFunc={() =>  setShowEdit(true)} closeFunc={() => setShowOptions(false)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
};