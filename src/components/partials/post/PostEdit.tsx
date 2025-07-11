import { useEffect, useRef, useState } from "react";
import { FormType, SimpleFunctionType } from "../../../../util/types";
import {
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../../features/book-api/book-api-slice";
import styled from "styled-components";
import ExpandableTextarea from "../ExpandableTextarea";
import { StyledCancel, StyledConfirm } from "../../../../util/style";
import { clickClass } from "../../../../util/globalValues";

export default function PostEdit({
  postid,
  closeModal,
}: {
  postid: string;
  closeModal: SimpleFunctionType;
}) {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [textValue, setTextValue] = useState("");
  const { postData } = useGetPostQuery(
    { id: postid },
    {
      selectFromResult: (result) => ({
        ...result,
        postData: result.data?.post,
      }),
    },
  );
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const addKeyCheck = function addEscToCancel(e: KeyboardEvent) {
      if (e.key === "Escape" && !isLoading) {
        closeModal();
        return;
      }
    };
    window.addEventListener("keydown", addKeyCheck);
    return () => {
      window.removeEventListener("keydown", addKeyCheck);
    };
  }, []);

  const handleSubmit = function handleSubmitingEdit(event: FormType) {
    event.preventDefault();
    if (cancelRef.current) {
      cancelRef.current.disabled = true;
    }
    const target = event.target as HTMLFormElement;
    const content = target.editInput.value;
    if (!postData) {
      if (cancelRef.current) {
        cancelRef.current.disabled = false;
      }
      return;
    }
    if (content === "" || !content) {
      if (cancelRef.current) {
        cancelRef.current.disabled = false;
      }
      return;
    }
    updatePost({ id: postData.id, content: content })
      .unwrap()
      .then(() => {
        closeModal();
      })
      .catch((e) => {
        if (e.data.message) {
          console.log(e.data.message);
        }
        if (cancelRef.current) {
          cancelRef.current.disabled = false;
        }
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
        <StyledBackground
          className={`modalBackground ${clickClass}`}
          onClick={(e) => {
            const target = e.target as HTMLDivElement;
            if (!target.closest(".modalContainer") && !isLoading) {
              closeModal();
              return;
            }
          }}
        >
          <StyledDiv className="modalContainer">
            <StyledForm onSubmit={handleSubmit}>
              <StyledTextarea
                names="editInput"
                textValue={textValue}
                setTextValue={setTextValue}
              />
              <StyledButtonsContainer>
                <StyledCancel
                  ref={cancelRef}
                  onClick={() => {
                    if (!isLoading) {
                      closeModal();
                      return;
                    }
                  }}
                  type="button"
                >
                  Cancel
                </StyledCancel>
                <StyledConfirm type="submit">Confirm</StyledConfirm>
              </StyledButtonsContainer>
            </StyledForm>
          </StyledDiv>
        </StyledBackground>
      )}
    </>
  );
}

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 50;
  background-color: rgba(184, 233, 255, 0.74);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTextarea = styled(ExpandableTextarea)`
  flex-grow: 1;
  min-height: 60px;
`;

const StyledDiv = styled.div`
  width: min(100%, 500px);
  padding: 15px;
  background-color: rgb(232, 255, 253);
  border: solid 1px black;
`;

const StyledButtonsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 3px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;
