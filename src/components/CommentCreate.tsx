import { useState } from "react";
import { useCreateCommentMutation } from "../features/book-api/book-api-slice";
import { FormType, SimpleFunctionType } from "../../util/types";
import { Image } from "lucide-react";
import ExpandableTextarea from "./ExpandableTextarea";
import styled from "styled-components";
import { StyledCancel, StyledConfirm } from "../../util/style";

export default function CommentCreate({postid, commentid, changeCreate, className, placeName} : {postid: string, commentid?: string, changeCreate?: SimpleFunctionType, className?:string, placeName?:string}) {
    const [ createComment ] = useCreateCommentMutation();
    const [ textValue, setTextValue ] = useState("");
    const [ invalidSize, setInvalidSize ] = useState(false);

    const handleClick = function handleSendingMessage(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLFormElement;
    const content = target.textInput.value;
    if (content === "" && target.fileInput.files.length === 0) {
      return;
    };

    const newForm = new FormData();

    if (target.fileInput.files.length > 0) {
      const possibleFile = target.fileInput.files[0] as File;
      if (possibleFile) {
        if (Number((possibleFile.size / 1024 / 1024).toFixed(4)) > 5) {
          if (!invalidSize) {
            setTimeout(() => {
              setInvalidSize(false);
            }, 5000);
          }
          setInvalidSize(true);
          return;
        }
        newForm.append("uploaded_file", possibleFile);
      }
    }

    newForm.append("content", content);

    if (typeof changeCreate === "function") {
      createComment({info: newForm, id: postid, ...(commentid ? {comment: commentid} : {})}).unwrap().then(() => {
        changeCreate();
      }).catch(() => {
        setTextValue("");
        target.reset();
      });
    } else {
      createComment({info: newForm, id: postid, ...(commentid ? {comment: commentid} : {})});
      setTextValue("");
      target.reset();
    };
  };

    return (
        <FormContainer className={className}>
            <form
                style={{ position: "relative" }}
                onSubmit={handleClick}
                onClick={(e) => e.stopPropagation()}
                >
                <StyledText
                names="textInput"
                textValue={textValue}
                setTextValue={setTextValue}
                {...(typeof placeName === "string" ? {placeName: placeName} : {})}
                />
                <StyledBottom>
                  <StyledFileDiv>
                      {invalidSize && (
                      <StyledFileError>File Too Big!(Max 5MB)</StyledFileError>
                      )}
                      <StyledLabel htmlFor="fileInput">
                        <Image />
                      </StyledLabel>
                      <StyledInputFile type="file" id="fileInput" name="fileInput" />
                  </StyledFileDiv>
                  <StyledButtonsContainer>
                      {
                        typeof changeCreate === "function" ? <StyledCancel type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          changeCreate();
                        }}
                        >Cancel</StyledCancel> : <></>
                    }
                    <StyledConfirm type="submit">Send</StyledConfirm>
                  </StyledButtonsContainer>
                </StyledBottom>
            </form>
        </FormContainer>
    )
};

const StyledText = styled(ExpandableTextarea)`
    width: min(100%, 700px);
`;

const StyledFileError = styled.div`
  position: absolute;
  bottom: -50%;
  right:  -150px;
  width: 150px;
  text-align: center;
  color: rgb(206, 0, 0);
`;

const StyledInputFile = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;


const StyledFileDiv = styled.div`
  position: relative;
  display: flex;
`;

const FormContainer = styled.div`
  width: 70%;
`;

const StyledBottom = styled.div`
  display: flex;
  justify-content: space-between;
  width: min(100%, 700px);
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  gap: 5px;
`;