import { useRef, useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { FormType, SimpleFunctionType } from "../../util/types";
import { useUpdateCommentMutation } from "../features/book-api/book-api-slice";

export default function CommentEdit({comment, changeEdit} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike, changeEdit: SimpleFunctionType}) {
    const [ updateComment ] = useUpdateCommentMutation();
    const [ textValue, setTextValue ] = useState(comment.content);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleSubmit = function handleSubmitingEdit(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    if (buttonRef.current) {
        buttonRef.current.disabled = true;
    };
    const target = event.target as HTMLFormElement;
    const content = target.textInput.value;
    if (content === "" || !content) {
        if (buttonRef.current) {
            buttonRef.current.disabled = false;
        };
        return;
    };

    updateComment({content: content, id: comment.id})
      .unwrap()
      .then(() => {
        changeEdit();
      })
      .catch((e) => {
        if (e.data.message) {
            if (buttonRef.current) {
                buttonRef.current.disabled = false;
            };
            console.log(e.data.message);
        }
      })
  };

    return (
        <div>
            <form
                style={{ position: "relative" }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                >
                <input
                    type="text"
                    id="textInput"
                    name="textInput"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
                />
                <button ref={buttonRef} onClick={(e) => {
                    e.stopPropagation()
                    changeEdit()}} type="button">
                    Cancel
                </button>
                <button type="submit">Confirm</button>
            </form>
        </div>
    )
};