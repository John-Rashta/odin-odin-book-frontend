import { useState } from "react";
import { useCreatePostMutation } from "../features/book-api/book-api-slice";
import { Image } from "lucide-react";
import { FormType } from "../../util/types";
import styled from "styled-components";
import ExpandableTextarea from "./ExpandableTextarea";

export default function PostCreate() {
    const [ createPost ] = useCreatePostMutation();
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

    createPost(newForm);
    target.reset();
    setTextValue("");
  };

    return (
        <FormContainer>
            <form
                style={{ position: "relative" }}
                onSubmit={handleClick}
                onClick={(e) => e.stopPropagation()}
                >
                <StyledTextarea
                  textValue={textValue}
                  setTextValue={setTextValue}
                  names="textInput"
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

const StyledFileError = styled.div`
  position: absolute;
  bottom: -50%;
  right:  -150px;
  width: 150px;
  text-align: center;
  color: rgb(206, 0, 0);
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
