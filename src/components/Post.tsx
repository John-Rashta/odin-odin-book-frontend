import { useSelector } from "react-redux"
import { selectMyId } from "../features/manager/manager-slice"
import { useChangePostLikeMutation } from "../features/book-api/book-api-slice";
import { FullPostInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { isUUID } from "validator";
import { formatRelative } from "date-fns";
import { locale } from "../../util/helpers";
import { ModalStartFunction } from "../../util/types";

export default function Post({info, modalFunc} : {info: FullPostInfo & Likes & YourLike & OwnCommentsCount, modalFunc?: ModalStartFunction}) {
    const myId = useSelector(selectMyId);
    const [ changeLike ] = useChangePostLikeMutation();
    
    return (
        <div data-id={info.id}>
            <div>
                <img data-userid={info.creator.id} src={info.creator.customIcon?.url || info.creator.icon.source} alt="" />
            </div>
            <div>
                <div>
                    <div>
                        <div data-userid={info.creator.id}>
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
                        {...(info.likes ? {style: {backgroundColor: "black"}} : {})}
                        onClick={(e) => {
                            e.currentTarget.disabled = true;
                            changeLike({id: info.id, action: (info.likes ? "REMOVE" : "ADD")}).unwrap().finally(() => {
                                e.currentTarget.disabled = false;
                            })
                        }}
                    >L</button>}
                </div>

            </div>
        </div>
    )
};