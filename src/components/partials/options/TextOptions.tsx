import { useLocation, useNavigate } from "react-router-dom";
import {
  ButtonClickType,
  ModalStartFunction,
  SimpleFunctionType,
} from "../../../../util/types";
import {
  useDeleteCommentMutation,
  useDeletePostMutation,
} from "../../../features/book-api/book-api-slice";
import React from "react";
import styled from "styled-components";
import ClickOutsideWrapper from "../wrappers/ClickOutsideWrapper";

export default function TextOptions({
  textId,
  editFunc,
  type,
  closeFunc,
  styleStuff,
  divRef,
}: {
  textId: string;
  editFunc: SimpleFunctionType | ModalStartFunction;
  type: "COMMENT" | "POST";
  closeFunc: SimpleFunctionType;
  styleStuff?: React.CSSProperties;
  divRef: React.RefObject<HTMLDivElement>;
}) {
  const [deletePost] = useDeletePostMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const handleDelete = function handleDeletesInOptions(event: ButtonClickType) {
    const currentTarget = event.currentTarget;
    currentTarget.disabled = true;

    if (type === "POST") {
      deletePost({ id: textId })
        .unwrap()
        .then(() => {
          if (pathname === "/post" && search.includes(`id=${textId}`)) {
            navigate("/");
          } else {
            closeFunc();
          }
        })
        .catch((result) => {
          if (result.data.message) {
            console.log(result.data.message);
          }
          currentTarget.disabled = false;
        });
      return;
    } else if (type === "COMMENT") {
      deleteComment({ id: textId })
        .unwrap()
        .then(() => {
          if (pathname === "/comment" && search.includes(`id=${textId}`)) {
            navigate("/");
          } else {
            closeFunc();
          }
        })
        .catch((result) => {
          if (result.data.message) {
            console.log(result.data.message);
          }
          currentTarget.disabled = false;
        });
      return;
    }
  };

  const handleEdit = function handleClickingEdit(event: ButtonClickType) {
    const currentTarget = event.currentTarget;
    currentTarget.disabled = true;

    editFunc(textId);
    closeFunc();
  };

  return (
    <StyledTextOptions
      divRef={divRef}
      closeFunc={closeFunc}
      style={{ ...styleStuff }}
    >
      <StyledButtons onClick={handleEdit}>Edit</StyledButtons>
      <StyledButtons onClick={handleDelete}>Delete</StyledButtons>
    </StyledTextOptions>
  );
}

const StyledTextOptions = styled(ClickOutsideWrapper)`
  position: absolute;
  max-width: 200px;
  width: 120px;
  z-index: 3;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: black;
`;

const StyledButtons = styled.button`
  border: none;
  flex-grow: 1;
  padding: 5px;
  background-color: rgb(196, 241, 255);
  &:hover {
    background-color: rgb(136, 207, 255);
  }
  font-weight: bold;
`;
