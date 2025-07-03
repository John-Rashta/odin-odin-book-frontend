import { useRef, useState } from "react";
import { FullCommentInfo, Likes, OwnCommentsCount, YourLike } from "../../util/interfaces";
import { FormType, SimpleFunctionType } from "../../util/types";
import { useUpdateCommentMutation } from "../features/book-api/book-api-slice";
import ExpandableTextarea from "./ExpandableTextarea";
import styled from "styled-components";
import { StyledCancel, StyledConfirm } from "../../util/style";

export default function CommentEdit({comment, changeEdit, className} : {comment: FullCommentInfo & Likes & OwnCommentsCount & YourLike, changeEdit: SimpleFunctionType, className?: string}) {
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
            <form
                className={className}
                style={{ position: "relative" }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                >
                <StyledText
                    names="textInput"
                    textValue={textValue}
                    setTextValue={setTextValue}
                />
                <StyledButtonsContainer>
                    <StyledCancel ref={buttonRef} onClick={(e) => {
                        e.stopPropagation()
                        changeEdit()}} type="button">
                        Cancel
                    </StyledCancel>
                    <StyledConfirm type="submit">Confirm</StyledConfirm>
                </StyledButtonsContainer>
            </form>
    )
};

const StyledButtonsContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const StyledText = styled(ExpandableTextarea)`
    width: min(100%, 700px);
`;
