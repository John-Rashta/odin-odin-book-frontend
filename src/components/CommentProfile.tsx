import { useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import CommentEdit from "./CommentEdit";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useSelector } from "react-redux";
import { selectMyId } from "../features/manager/manager-slice";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { Ellipsis } from "lucide-react";
import TextOptions from "./TextOptions";

export default function CommentProfile({comment} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike}) {
    const [showOptions, setShowOptions] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();

    return (
        <>
    {showEdit ? <CommentEdit comment={comment} changeEdit={() =>  setShowEdit(false)} /> :
            <div>
                <div className="clickOption userOption" data-userid={comment.senderid}>
                    <img src={comment.sender.customIcon?.url || comment.sender.icon.source} alt="" />
                </div>
                <div>
                    <div>
                        <div className="clickOption userOption" data-userid={comment.senderid}>
                            {comment.sender.username}
                        </div>
                        <div>
                            {formatRelative(new Date(comment.sentAt), new Date(), { locale })}
                        </div>
                        <div>
                            {comment.edited ? "Edited" : ""}
                        </div>
                    </div>
                    <div>
                        {comment.content}
                    </div>
                    <div>
                        <div>
                            {comment.ownCommentsCount > 0 ? comment.ownCommentsCount : ""}
                        </div>
                        <div>
                            {comment.likesCount > 0 ? comment.likesCount : ""}
                        </div>
                        { isUUID(myId) &&
                            <button 
                                {...((comment.likes && comment.likes.length > 0) ? {style: {backgroundColor: "black"}} : {})}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.currentTarget.disabled = true;
                                    changeLike({id: comment.id, action: ((comment.likes && comment.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                        e.currentTarget.disabled = false;
                                    })
                                }}
                            >L</button>
                        }
                        <div>
                            {
                                myId === comment.senderid ? <Ellipsis onClick={(e) => {
                                    e.stopPropagation();
                                    setShowOptions(!showOptions);
                                }} /> : <></>
                            }
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