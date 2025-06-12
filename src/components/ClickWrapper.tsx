import React from "react";
import { ClickType } from "../../util/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCommentId, setPostId, setUserId } from "../features/manager/manager-slice";

export default function ClickWrapper({children} : {children: React.ReactNode}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleClick = function handleClickingToRedirect(event: ClickType) {
        event.stopPropagation();
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (!target.closest(".clickOption")) {
            return;
        };
        const possibleUser = target.closest(".userOption") as HTMLElement | null;
        if (possibleUser) {
            const userId = possibleUser.dataset.userid;
            if (!userId) {
                return;
            };
            dispatch(setUserId(userId));
            navigate("/user");
            return;
        };
        const possiblePost = target.closest(".postOption") as HTMLElement | null;
        if (possiblePost) {
            const postId = possiblePost.dataset.postid;
            if (!postId) {
                return;
            }
            dispatch(setPostId(postId));
            navigate("/post");
            return;
        };
        const possibleComment = target.closest(".commentOption") as HTMLElement | null;
        if (possibleComment) {
            const commentId = possibleComment.dataset.commentid;
            if (!commentId) {
                return;
            };
            dispatch(setCommentId(commentId));
            navigate("/comment");
            return;
        } else if (target.closest(".requestOption")) {
            navigate("/requests");
            return;
        };
    };

    return (
        <div onClick={handleClick}>
            {children}
        </div>
    )
};