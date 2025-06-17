import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { isUUID } from "validator";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { ModalStartFunction } from "../../util/types";
import { useState } from "react";
import { Ellipsis } from "lucide-react";
import TextOptions from "./TextOptions";

export default function Post({info, modalFunc} : {info: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    const [showOptions, setShowOptions] = useState(false);
    
    return (
        <div className="clickOption postOption" data-postid={info.id}>
            <div>
                <img className="userOption" data-userid={info.creator.id} src={info.creator.customIcon?.url || info.creator.icon.source} alt="" />
            </div>
            <div>
                <div>
                    <div>
                        <div className="userOption" data-userid={info.creator.id}>
                        {info.creator.username}
                        </div>
                        <div>
                            {formatRelative(new Date(info.createdAt), new Date(), { locale })}
                        </div>
                    </div>
                    <div>
                        {info.edited? "Edited" : ""}
                    </div>
                </div>
                <div>
                    <div>
                        {info.content}
                    </div>
                    {info.image ? <img src={info.image.url} alt="" /> : <></>}
                </div>
                <div>
                    <div>
                        {info.ownCommentsCount}
                    </div>
                    <div>
                        {info.likesCount}
                    </div>
                    { isUUID(myId) &&
                    <button 
                        {...((info.likes && info.likes.length > 0) ? {style: {backgroundColor: "black"}} : {})}
                        onClick={(e) => {
                            e.stopPropagation();
                            ///e.currentTarget.disabled = true;
                            changeLike({id: info.id, action: ((info.likes && info.likes.length > 0) ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                ///e.currentTarget.disabled = false;
                            })
                        }}
                    >L</button>
                    }
                    <div style={{position: "relative"}}>
                        {
                            myId === info.creatorid ? <Ellipsis onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }} /> : <></>
                        }
                        {
                        (showOptions && typeof modalFunc === "function") && <TextOptions textId={info.id} type="POST" editFunc={modalFunc} closeFunc={() => setShowOptions(false)} />
                        }
                    </div>
                </div>

            </div>
        </div>
    )
};