import { ButtonClickType, ModalStartFunction, SimpleFunctionType } from "../../util/types";
import { useDeleteCommentMutation, useDeletePostMutation } from "../features/book-api/book-api-slice";

export default function TextOptions({textId, editFunc, type, closeFunc} : {textId: string, editFunc: SimpleFunctionType | ModalStartFunction, type: "COMMENT" | "POST", closeFunc: SimpleFunctionType}) {
    const [ deletePost ] = useDeletePostMutation();
    const [ deleteComment ] = useDeleteCommentMutation();

    const handleDelete = function handleDeletesInOptions(event: ButtonClickType) {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        currentTarget.disabled = true;

        if (type === "POST") {
            deletePost({id: textId}).unwrap().then(() => {
                closeFunc();
            }).catch((result) => {
                if (result.data.message) {
                    console.log(result.data.message);
                };
                currentTarget.disabled = false;
            });
            return;
        } else if (type === "COMMENT") {
            deleteComment({id: textId}).unwrap().then(() => {
                closeFunc();
            }).catch((result) => {
                if (result.data.message) {
                    console.log(result.data.message);
                };
                currentTarget.disabled = false;
            });;
            return;
        }
    };

    const handleEdit = function handleClickingEdit (event: ButtonClickType) {
        event.stopPropagation();
        event.preventDefault();
        const currentTarget = event.currentTarget;
        currentTarget.disabled = true;

        if (type === "POST") {
            editFunc(textId);
            closeFunc();
            return;
        } else if (type === "COMMENT") {
            editFunc(textId);
        };

    };

    return (
        <div style={{position: "absolute"}}>
            <button onClick={handleEdit}>
                Edit
            </button>
            <button onClick={handleDelete}>
                Delete
            </button>
        </div>
    )
};