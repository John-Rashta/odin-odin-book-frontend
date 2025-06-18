import { useState } from "react";
import { useCreateCommentMutation } from "../features/book-api/book-api-slice";
import { FormType, SimpleFunctionType } from "../../util/types";
import { Image } from "lucide-react";

export default function CommentCreate({postid, commentid, changeCreate} : {postid: string, commentid?: string, changeCreate?: SimpleFunctionType}) {
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
        <div>
            <form
                style={{ position: "relative" }}
                onSubmit={handleClick}
                onClick={(e) => e.stopPropagation()}
                >
                <input
                    type="text"
                    id="textInput"
                    name="textInput"
                    value={textValue}
                    onChange={(e) => setTextValue(e.target.value)}
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
                {
                    typeof changeCreate === "function" ? <button type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      changeCreate();
                    }}
                    >Cancel</button> : <></>
                }
                <button type="submit">Send</button>
            </form>
        </div>
    )
};