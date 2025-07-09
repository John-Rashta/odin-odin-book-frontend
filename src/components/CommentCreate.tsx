import { useState } from "react";
import { useCreateCommentMutation } from "../features/book-api/book-api-slice";
import { FormType, SimpleFunctionType } from "../../util/types";
import { Image } from "lucide-react";
import ExpandableTextarea from "./ExpandableTextarea";
import styled from "styled-components";
import { StyledCancel, StyledConfirm, StyledFileDiv, StyledFileLabel, StyledFlex, StyledInputFile } from "../../util/style";
import { clickClass } from "../../util/globalValues";
import FileDiv from "./FileDiv";

export default function CommentCreate({postid, commentid, changeCreate, className, placeName} : {postid: string, commentid?: string, changeCreate?: SimpleFunctionType, className?:string, placeName?:string}) {
    const [ createComment, {isLoading} ] = useCreateCommentMutation();
    const [ textValue, setTextValue ] = useState("");
    const [ invalidSize, setInvalidSize ] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleClick = function handleSendingMessage(event: FormType) {
    event.preventDefault();
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
        setFileName("");
      });
    } else {
      createComment({info: newForm, id: postid, ...(commentid ? {comment: commentid} : {})});
      setTextValue("");
      target.reset();
      setFileName("");
    };
  };

    return (
        <FormContainer className={`${className || ""} ${clickClass}`}>
            <form
                style={{ position: "relative" }}
                onSubmit={handleClick}
                >
                <StyledText
                names="textInput"
                textValue={textValue}
                setTextValue={setTextValue}
                {...(typeof placeName === "string" ? {placeName: placeName} : {})}
                />
                <StyledBottom>
                  <FileDiv fileName={fileName} setFileName={setFileName} invalidSize={invalidSize} />
                  <StyledFlex>
                      {
                        typeof changeCreate === "function" ? <StyledCancel type="button"
                        onClick={(e) => {
                          if (!isLoading) {
                            changeCreate();
                            return;
                          }
                        }}
                        >Cancel</StyledCancel> : <></>
                    }
                    <StyledConfirm type="submit">Send</StyledConfirm>
                  </StyledFlex>
                </StyledBottom>
            </form>
        </FormContainer>
    )
};

const StyledText = styled(ExpandableTextarea)`
    width: min(100%, 700px);
`;

const FormContainer = styled.div`
  width: 70%;
`;

const StyledBottom = styled.div`
  display: flex;
  justify-content: space-between;
  width: min(100%, 700px);
`;