import { useState } from "react";
import { useCreatePostMutation } from "../features/book-api/book-api-slice";
import { FormType } from "../../util/types";
import styled from "styled-components";
import ExpandableTextarea from "./ExpandableTextarea";
import { clickClass } from "../../util/globalValues";
import FileDiv from "./FileDiv";

export default function PostCreate({placeName} : {placeName?: string}) {
    const [ createPost ] = useCreatePostMutation();
    const [ textValue, setTextValue ] = useState("");
    const [ invalidSize, setInvalidSize ] = useState(false);

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

    createPost(newForm);
    target.reset();
    setTextValue("");
  };

    return (
        <FormContainer className={`${clickClass}`}>
            <form
                style={{ position: "relative" }}
                onSubmit={handleClick}
                >
                <StyledTextarea
                  textValue={textValue}
                  setTextValue={setTextValue}
                  names="textInput"
                  {...(typeof placeName === "string" ? {placeName: placeName} : {})}
                />
                <StyledBottom>
                  <FileDiv invalidSize={invalidSize} />
                  <StyledButton type="submit">Send</StyledButton>
                </StyledBottom>
            </form>
        </FormContainer>
    )
};

const StyledTextarea = styled(ExpandableTextarea)`
  width: 100%;
  max-width: 100%;
  min-height: 60px;
`;

const FormContainer = styled.div`
  width: 70%;
`;

const StyledBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  background-color: rgb(223, 242, 255);
  &:hover {
    background-color: rgb(178, 224, 255);
  };
  border-radius: 5px;
`;
