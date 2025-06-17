import React from "react";
import { ClickType } from "../../util/types";
import { useNavigate } from "react-router-dom";

export default function ClickWrapper({children} : {children: React.ReactNode}) {
    const navigate = useNavigate();
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
            navigate(`/user?id=${userId}`);
            return;
        };
        const possiblePost = target.closest(".postOption") as HTMLElement | null;
        if (possiblePost) {
            const postId = possiblePost.dataset.postid;
            if (!postId) {
                return;
            };
            navigate(`/post?id=${postId}`);
            return;
        };
        const possibleComment = target.closest(".commentOption") as HTMLElement | null;
        if (possibleComment) {
            const commentId = possibleComment.dataset.commentid;
            if (!commentId) {
                return;
            };
            navigate(`/comment?id=${commentId}`);
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