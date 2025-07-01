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
        <div>
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
                <div>
                    {invalidSize && (
                    <div>File Too Big!(Max 5MB)</div>
                    )}
                    <label htmlFor="fileInput">
                    <Image />
                    </label>
                    <input type="file" id="fileInput" name="fileInput" />
                </div>
                <button type="submit">Send</button>
            </form>
        </div>
    )
};

const StyledTextarea = styled(ExpandableTextarea)`
  width: 70%;
  max-width: 70%;
  min-height: 60px;
`;