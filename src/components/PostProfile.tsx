import { useSelector } from "react-redux";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { selectMyId } from "../features/manager/manager-slice";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { isUUID } from "validator";
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { ModalStartFunction } from "../../util/types";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import TextOptions from "./TextOptions";

export default function PostProfile({post, modalFunc} : {post: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
     const [showOptions, setShowOptions] = useState(false);
    return (
        <div>
            <div>
                <img className="clickOption userOption" data-userid={post.creator.id} src={post.creator.customIcon?.url || post.creator.icon.source} alt="" />
                <div className="clickOption userOption" data-userid={post.creator.id}>
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
                        e.stopPropagation();
                        e.currentTarget.disabled = true;
                        changeLike({id: post.id, action: (post.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                            e.currentTarget.disabled = false;
                        })
                    }}
                >L</button>
                }
                {
                    myId === post.creatorid ? <Ellipsis onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(!showOptions);
                    }} /> : <></>
                }
                {
                (showOptions && typeof modalFunc === "function") && <TextOptions textId={post.id} type="POST" editFunc={modalFunc} closeFunc={() => setShowOptions(false)} />
                }
            </div>
        </div>
    )
};