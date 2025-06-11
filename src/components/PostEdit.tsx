import { useEffect, useRef, useState } from "react";
import { FormType, SimpleFunctionType } from "../../util/types";
import { useGetPostQuery, useUpdatePostMutation } from "../features/book-api/book-api-slice";

export default function PostEdit({postid, closeModal} : {postid: string, closeModal: SimpleFunctionType}) {
  const [updatePost] = useUpdatePostMutation();
  const [textValue, setTextValue] = useState("");
  const { postData } = useGetPostQuery(
    {id: postid},
    {
      selectFromResult: (result) => ({
        ...result,
        postData: result.data?.post,
      }),
    },
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = function handleSubmitingEdit(event: FormType) {
    event.preventDefault();
    event.stopPropagation();
    if (cancelRef.current) {
        cancelRef.current.disabled = true;
    };
    const target = event.target as HTMLFormElement;
    const content = target.editInput.value;
    if (!postData) {
        if (cancelRef.current) {
            cancelRef.current.disabled = false;
        };
        return;
    };
    if (content === "" && !postData.image) {
        if (cancelRef.current) {
            cancelRef.current.disabled = false;
        };
        return;
    };
    updatePost({id: postData.id, content: content })
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((e) => {
        if (e.data.message) {
          console.log(e.data.message);
        };
        if (cancelRef.current) {
            cancelRef.current.disabled = false;
        };
      });
  };

  useEffect(() => {
    const addMessageValue = function addValueToMessage() {
      if (!postData) {
        return;
      }
      setTextValue(postData.content);
    };
    addMessageValue();
  }, [postData]);

  return (
    <>
      {postData && (
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            name="editInput"
            id="editInput"
            onChange={(e) => setTextValue(e.target.value)}
            value={textValue}
          />
          <button ref={cancelRef} onClick={() => closeModal()} type="button">
            Cancel
          </button>
          <button type="submit">Confirm</button>
        </form>
      )}
    </>
  );
};