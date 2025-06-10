import { useSelector } from "react-redux";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";

export default function PostProfile({post} : {post: FullPostInfo & Likes & YourLike & OwnCommentsCount}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    return (
        <div>
            <div>
                <img src={post.creator.customIcon?.url || post.creator.icon.source} alt="" />
                <div>
                    {post.creator.username}
                </div>
            </div>
            <div>
                <div>
                    {post.content}
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
                { isUUID(myId) &&
                <button 
                    {...(post.likes ? {style: {backgroundColor: "black"}} : {})}
                    onClick={(e) => {
                        e.currentTarget.disabled = true;
                        changeLike({id: post.id, action: (post.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                            e.currentTarget.disabled = false;
                        })
                    }}
                >L</button>}
            </div>
        </div>
    )
};